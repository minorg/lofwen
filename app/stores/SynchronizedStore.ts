import * as UiReactWithSchemas from "tinybase/ui-react/with-schemas";
import {
  type NoValuesSchema,
  type TablesSchema,
  type Store as _Store,
  createStore,
} from "tinybase/with-schemas";

export type SynchronizedStore = _Store<
  [typeof SynchronizedStore.tablesSchema, NoValuesSchema]
>;

export namespace SynchronizedStore {
  export function create(): SynchronizedStore {
    return createStore().setTablesSchema(SynchronizedStore.tablesSchema);
  }

  export const UiReact = UiReactWithSchemas as UiReactWithSchemas.WithSchemas<
    [typeof SynchronizedStore.tablesSchema, NoValuesSchema]
  >;

  export const tablesSchema: TablesSchema = {
    log: {
      json: { type: "string" },
      timestamp: { type: "number" },
      type: { type: "string" },
    },
  } as const;
}
