import type {
  NoValuesSchema,
  TablesSchema,
  Store as _TinyBaseStore,
} from "tinybase/with-schemas";
import { Action } from "~/models";
import type { Store } from "~/stores/Store";

export class TinyBaseStore implements Store {
  constructor(
    private readonly delegate: _TinyBaseStore<
      [typeof TinyBaseStore.tablesSchema, NoValuesSchema]
    >,
  ) {}

  addAction(action: Action): void {
    this.delegate.setRow("action", action.identifier, {
      json: JSON.stringify(action),
    });
  }

  get actions(): readonly Action[] {
    return Object.values(this.delegate.getTable("action")).flatMap((row) => {
      const parsed = Action.schema.safeParse(row["json"]);
      return parsed.success ? [parsed.data] : [];
    });
  }
}

export namespace TinyBaseStore {
  const tableSchema = {
    json: { type: "string" },
  } as const;

  export const tablesSchema: TablesSchema = {
    action: tableSchema,
  } as const;
}
