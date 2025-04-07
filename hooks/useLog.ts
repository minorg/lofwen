import { useMemo } from "react";
import { Store } from "~/Store";
import type { Log } from "~/models";
import { StoredLog } from "~/models/StoredLog";

export function useLog(): Log {
  const { useTable } = Store.UiReact;
  const table = useTable("log");
  return useMemo(() => new StoredLog(table), [table]);
}
