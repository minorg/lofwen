import {
  type NoValuesSchema,
  type TablesSchema,
  type Store as _UnderlyingStore,
  createStore,
} from "tinybase/with-schemas";
import { Action, Event } from "~/models";
import type { Store } from "~/stores/Store";

export class TinyBaseStore implements Store {
  constructor(readonly underlyingStore: TinyBaseStore.UnderlyingStore) {}

  static create(): TinyBaseStore {
    return new TinyBaseStore(
      createStore().setTablesSchema(TinyBaseStore.tablesSchema),
    );
  }

  addAction(action: Action): void {
    this.underlyingStore.setRow("action", action.identifier, {
      json: JSON.stringify(action),
    });
  }

  addEvent(event: Event): void {
    this.underlyingStore.setRow("event", event.identifier, {
      json: JSON.stringify(event),
    });
  }

  get actions(): readonly Action[] {
    return Object.values(this.underlyingStore.getTable("action")).flatMap(
      (row) => {
        const parsed = Action.schema.safeParse(
          JSON.parse(row["json"] as string),
        );
        return parsed.success ? [parsed.data] : [];
      },
    );
  }

  get events(): readonly Event[] {
    return Object.values(this.underlyingStore.getTable("event")).flatMap(
      (row) => {
        const parsed = Event.schema.safeParse(
          JSON.parse(row["json"] as string),
        );
        return parsed.success ? [parsed.data] : [];
      },
    );
  }
}

export namespace TinyBaseStore {
  export type UnderlyingStore = _UnderlyingStore<
    [typeof TinyBaseStore.tablesSchema, NoValuesSchema]
  >;

  const tableSchema = {
    json: { type: "string" },
  } as const;

  export const tablesSchema: TablesSchema = {
    action: tableSchema,
    event: tableSchema,
  } as const;
}
