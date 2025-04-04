import {} from "tinybase/ui-react";
import { Store } from "~/Store";
import type { Event } from "~/models";

export function useAddEvent() {
  const { useSetRowCallback } = Store.Hooks;
  return useSetRowCallback(
    "event",
    (event: Event) => event.identifier,
    (event: Event) => ({
      json: JSON.stringify(event),
    }),
  );
}
