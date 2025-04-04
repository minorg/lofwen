import { useMemo } from "react";
import { Store } from "~/Store";
import { parseLogRow } from "~/hooks/parseLogRow";
import type { Action } from "~/models";

export function useLastAction(): Action | null {
  const { useTable } = Store.Hooks;
  const table = useTable("log");
  return useMemo(() => {
    const rowEntries = Object.entries(table);
    for (let rowI = rowEntries.length - 1; rowI >= 0; rowI--) {
      const rowEntry = rowEntries[rowI]!;
      const row = rowEntry[1];
      if (row["type"] !== "Action") {
        continue;
      }
      const logEntry = parseLogRow(rowEntry[0], row);
      if (logEntry !== null) {
        return logEntry as Action;
      }
    }
    return null;
  }, [table]);
}
