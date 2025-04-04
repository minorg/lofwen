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

  const tableSchema = {
    json: { type: "string" },
  } as const;

  export const tablesSchema: TablesSchema = {
    action: tableSchema,
    event: tableSchema,
  } as const;
}

// export class TinyBaseStore implements Store {
//   constructor(readonly underlyingStore: TinyBaseStore.UnderlyingStore) {}

//   static create(): TinyBaseStore {
//   }

//   addAction(action: Action): void {
//     this.underlyingStore.setRow("action", action.identifier, {
//       json: JSON.stringify(action),
//     });
//   }

//   addEvent(event: Event): void {
//     this.underlyingStore.setRow("event", event.identifier, {
//       json: JSON.stringify(event),
//     });
//   }

//   get actions(): readonly Action[] {
//     return Object.values(this.underlyingStore.getTable("action")).flatMap(
//       (row) => {
//         const parsed = Action.schema.safeParse(
//           JSON.parse(row["json"] as string),
//         );
//         return parsed.success ? [parsed.data] : [];
//       },
//     );
//   }

//   get events(): readonly Event[] {
//     return Object.values(this.underlyingStore.getTable("event")).flatMap(
//       (row) => {
//         const parsed = Event.schema.safeParse(
//           JSON.parse(row["json"] as string),
//         );
//         return parsed.success ? [parsed.data] : [];
//       },
//     );
//   }
// }

// }
