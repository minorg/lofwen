import * as UiReactWithSchemas from "tinybase/ui-react/with-schemas";
import {
  type MergeableStore,
  type NoValuesSchema,
  type TablesSchema,
  createMergeableStore,
} from "tinybase/with-schemas";

export type SynchronizedStore = MergeableStore<
  [typeof SynchronizedStore.tablesSchema, NoValuesSchema]
>;

export namespace SynchronizedStore {
  export function create(): SynchronizedStore {
    return createMergeableStore().setTablesSchema(
      SynchronizedStore.tablesSchema,
    );
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
