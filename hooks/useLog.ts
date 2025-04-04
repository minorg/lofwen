import { useMemo } from "react";
import { Store } from "~/Store";
import { LogEntry } from "~/models";

export function useLog() {
  const { useTable } = Store.Hooks;
  const table = useTable("log");
  return useMemo(
    () =>
      Object.entries(table).flatMap(([rowId, row]) => {
        const rowJsonParsed = JSON.parse(row["json"] as string);
        const logEntryJson = {
          identifier: rowId,
          logEntryType: row["type"],
          timestamp: row["timestamp"],
          ...rowJsonParsed,
        };
        const logEntryParsed = LogEntry.schema.safeParse(logEntryJson);
        return logEntryParsed.success ? [logEntryParsed.data] : [];
      }),
    [table],
  );
}
