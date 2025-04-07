import type { Row, Table } from "tinybase/with-schemas";
import type { Store } from "~/Store";
import type { AcknowledgmentAction } from "~/models/AcknowledgmentAction";
import type { Action } from "~/models/Action";
import type { Identifier } from "~/models/Identifier";
import type { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";
import { LogEntry } from "~/models/LogEntry";

function logEntryToAction(logEntry: LogEntry): Action | null {
  switch (logEntry["@type"]) {
    case "AcknowledgmentAction":
      return logEntry as AcknowledgmentAction;
    case "LikertScaleQuestionAction":
      return logEntry as LikertScaleQuestionAction;
    case "InitialEvent":
    case "LikertScaleAnswerEvent":
      return null;
  }
}

export class Log implements Iterable<LogEntry> {
  private readonly parsedRowCache: Record<Identifier, LogEntry | null> = {};

  constructor(
    private readonly table: Table<typeof Store.tablesSchema, "log">,
  ) {}

  actionById(id: Identifier): Action | null {
    const entry = this.entryById(id);
    return entry ? logEntryToAction(entry) : null;
  }

  *actions(): Iterable<Action> {
    for (const entry of this) {
      const action = logEntryToAction(entry);
      if (action !== null) {
        yield action;
      }
    }
  }

  *entries(): Iterable<LogEntry> {
    for (const rowEntry of Object.entries(this.table)) {
      const logEntry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (logEntry !== null) {
        yield logEntry;
      }
    }
  }

  entryById(id: Identifier): LogEntry | null {
    const parsedEntry = this.parsedRowCache[id];
    if (typeof parsedEntry !== "undefined") {
      return parsedEntry!;
    }
    for (const entry of this.reverse()) {
      if (entry["@id"] === id) {
        return entry;
      }
    }
    return null;
  }

  find(predicate: (entry: LogEntry) => boolean): LogEntry | null {
    for (const entry of this.entries()) {
      if (predicate(entry)) {
        return entry;
      }
    }
    return null;
  }

  *[Symbol.iterator](): Iterator<LogEntry> {
    yield* this.entries();
  }

  get lastAction(): Action | null {
    for (const entry of this.reverse()) {
      const action = logEntryToAction(entry);
      if (action !== null) {
        return action;
      }
    }
    return null;
  }

  get length(): number {
    return Object.values(this.table).length;
  }

  *reverse(): Iterable<LogEntry> {
    const rowEntries = Object.entries(this.table);
    for (let rowI = rowEntries.length - 1; rowI >= 0; rowI--) {
      const rowEntry = rowEntries[rowI]!;
      const logEntry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (logEntry !== null) {
        yield logEntry;
      }
    }
  }

  private parseRow(
    rowId: Identifier,
    row: Row<typeof Store.tablesSchema, "log", false>,
  ): LogEntry | null {
    {
      const logEntry = this.parsedRowCache[rowId];
      if (typeof logEntry !== "undefined") {
        return logEntry;
      }
    }

    const jsonCellParsed = JSON.parse(row["json"] as string);
    const logEntryJsonObject = {
      identifier: rowId,
      logEntryType: row["type"],
      timestamp: row["timestamp"],
      ...jsonCellParsed,
    };
    const logEntryParseResult = LogEntry.schema.safeParse(logEntryJsonObject);
    if (!logEntryParseResult.success) {
      return null;
    }
    const logEntry = logEntryParseResult.data;
    this.parsedRowCache[rowId] = logEntry;
    return logEntry;
  }
}
