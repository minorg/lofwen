import type { Row, Table } from "tinybase/with-schemas";
import { logger } from "~/logger";
import type { Identifier } from "~/models/Identifier";
import { Log } from "~/models/Log";
import type { SynchronizedStore } from "~/stores/SynchronizedStore";

/**
 * Log implementation backed by a TinyBase store.
 */
export class StoredLog extends Log {
  private readonly parsedRowCache: Record<Identifier, Log.Entry | null> = {};

  constructor(
    private readonly table: Table<typeof SynchronizedStore.tablesSchema, "log">,
  ) {
    super();
  }

  override *entries(): Iterable<Log.Entry> {
    for (const rowEntry of Object.entries(this.table)) {
      const logEntry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (logEntry !== null) {
        yield logEntry;
      }
    }
  }

  override get length(): number {
    return Object.values(this.table).length;
  }

  override *reverse(): Iterable<Log.Entry> {
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
    row: Row<typeof SynchronizedStore.tablesSchema, "log", false>,
  ): Log.Entry | null {
    {
      const logEntry = this.parsedRowCache[rowId];
      if (typeof logEntry !== "undefined") {
        return logEntry;
      }
    }

    const jsonCellParsed = JSON.parse(row["json"] as string);
    const logEntryJsonObject = {
      "@type": row["type"],
      timestamp: row["timestamp"],
      ...jsonCellParsed,
    };
    const logEntryParseResult = Log.Entry.schema.safeParse(logEntryJsonObject);
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
