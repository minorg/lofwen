import type { Row, Table } from "tinybase/with-schemas";
import type { Store } from "~/Store";
import { logger } from "~/logger";
import type { Identifier } from "~/models/Identifier";
import { Log } from "~/models/Log";
import { LogEntry } from "~/models/LogEntry";

/**
 * Log implementation backed by a TinyBase store.
 */
export class StoredLog extends Log {
  private readonly parsedRowCache: Record<Identifier, LogEntry | null> = {};

  constructor(private readonly table: Table<typeof Store.tablesSchema, "log">) {
    super();
  }

  override *entries(): Iterable<LogEntry> {
    for (const rowEntry of Object.entries(this.table)) {
      const logEntry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (logEntry !== null) {
        yield logEntry;
      }
    }
  }

  override entryById(id: Identifier): LogEntry | null {
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

  override get length(): number {
    return Object.values(this.table).length;
  }

  override *reverse(): Iterable<LogEntry> {
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
      "@id": rowId,
      "@type": row["type"],
      "@timestamp": row["timestamp"],
      ...jsonCellParsed,
    };
    const logEntryParseResult = LogEntry.schema.safeParse(logEntryJsonObject);
    if (!logEntryParseResult.success) {
      logger.warn(
        "unable to parse log row",
        rowId,
        "\n",
        logEntryParseResult.error,
        "\n",
        JSON.stringify(row),
        "\n",
        JSON.stringify(logEntryJsonObject),
      );
      return null;
    }
    const logEntry = logEntryParseResult.data;
    this.parsedRowCache[rowId] = logEntry;
    return logEntry;
  }
}
