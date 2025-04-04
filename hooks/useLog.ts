import { useMemo } from "react";
import { Store } from "~/Store";
import { parseLogRow } from "~/hooks/parseLogRow";

export function useLog() {
  const { useTable } = Store.Hooks;
  const table = useTable("log");
  return useMemo(
    () =>
      Object.entries(table).flatMap(([rowId, row]) => {
        const logEntry = parseLogRow(rowId, row);
        return logEntry !== null ? logEntry : null;
      }),
    [table],
  );
}
