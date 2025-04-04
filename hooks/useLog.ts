import { useMemo } from "react";
import { Store } from "~/Store";
import { Log } from "~/models";

export function useLog(): Log {
  const { useTable } = Store.UiReact;
  const table = useTable("log");
  return useMemo(() => new Log(table), [table]);
}
