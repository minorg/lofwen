import type { Row, Table } from "tinybase/with-schemas";
import type { Store } from "~/Store";
import type { Action } from "~/models/Action";
import type { Identifier } from "~/models/Identifier";
import { LogEntry } from "~/models/LogEntry";

export class Log implements Iterable<LogEntry> {
  private readonly parsedRowCache: Record<Identifier, LogEntry | null> = {};

  constructor(
    private readonly table: Table<typeof Store.tablesSchema, "log">,
  ) {}

  actionByIdentifier(identifier: Identifier): Action | null {
    const entry = this.entryByIdentifier(identifier);
    return entry?.logEntryType === "Action" ? entry : null;
  }

  entryByIdentifier(identifier: Identifier): LogEntry | null {
    const parsedEntry = this.parsedRowCache[identifier];
    if (typeof parsedEntry !== "undefined") {
      return parsedEntry!;
    }
    for (const entry of this.reverse()) {
      if (entry.identifier === identifier) {
        return entry;
      }
    }
    return null;
  }

  *[Symbol.iterator](): Iterator<LogEntry> {
    for (const rowEntry of Object.entries(this.table)) {
      const logEntry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (logEntry !== null) {
        yield logEntry;
      }
    }
  }

  get lastAction(): Action | null {
    for (const entry of this.reverse()) {
      if (entry.logEntryType === "Action") {
        return entry;
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
