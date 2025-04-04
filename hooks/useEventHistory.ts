import { useMemo } from "react";
import { Store } from "~/Store";
import { Event } from "~/models";

export function useEventHistory() {
  const { useTable } = Store.Hooks;
  const table = useTable("event");
  return useMemo(
    () =>
      Object.values(table).flatMap((row) => {
        const parsed = Event.schema.safeParse(
          JSON.parse(row["json"] as string),
        );
        return parsed.success ? [parsed.data] : [];
      }),
    [table],
  );
}
