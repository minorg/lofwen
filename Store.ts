import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  type NoValuesSchema,
  type TablesSchema,
  type Store as _Store,
  createStore,
} from "tinybase/with-schemas";

export type Store = _Store<[typeof Store.tablesSchema, NoValuesSchema]>;

export namespace Store {
  export function create(): Store {
    return createStore().setTablesSchema(Store.tablesSchema);
  }

  export const Hooks = UiReact as UiReact.WithSchemas<
    [typeof Store.tablesSchema, NoValuesSchema]
  >;

  export const tablesSchema: TablesSchema = {
    log: {
      json: { type: "string" },
      identifier: { type: "string" },
      timestamp: { type: "number" },
      type: { type: "string" },
    },
  } as const;
}
