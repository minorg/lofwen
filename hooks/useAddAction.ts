import {} from "tinybase/ui-react";
import { Store } from "~/Store";
import type { Action } from "~/models";

export function useAddAction() {
  const { useSetRowCallback } = Store.Hooks;
  return useSetRowCallback(
    "action",
    (action: Action) => action.identifier,
    (action: Action) => ({
      json: JSON.stringify(action),
    }),
  );
}
