import { useMemo } from "react";
import type { Log } from "~/models";
import { StoredLog } from "~/models/StoredLog";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

export function useLog(): Log {
  const { useTable } = SynchronizedStore.UiReact;
  const table = useTable("log");
  return useMemo(() => new StoredLog(table), [table]);
}
