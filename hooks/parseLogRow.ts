import type { Row } from "tinybase/with-schemas";
import type { Store } from "~/Store";
import { type Identifier, LogEntry } from "~/models";

export function parseLogRow(
  rowId: Identifier,
  row: Row<typeof Store.tablesSchema, "log", false>,
): LogEntry | null {
  const rowJsonParsed = JSON.parse(row["json"] as string);
  const logEntryJson = {
    identifier: rowId,
    logEntryType: row["type"],
    timestamp: row["timestamp"],
    ...rowJsonParsed,
  };
  const logEntryParsed = LogEntry.schema.safeParse(logEntryJson);
  return logEntryParsed.success ? logEntryParsed.data : null;
}
