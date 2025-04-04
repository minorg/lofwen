import { useMemo } from "react";
import { Store } from "~/Store";
import { Action } from "~/models";

export function useActionHistory() {
  const { useTable } = Store.Hooks;
  const table = useTable("action");
  return useMemo(
    () =>
      Object.values(table).flatMap((row) => {
        const parsed = Action.schema.safeParse(
          JSON.parse(row["json"] as string),
        );
        return parsed.success ? [parsed.data] : [];
      }),
    [table],
  );
}
