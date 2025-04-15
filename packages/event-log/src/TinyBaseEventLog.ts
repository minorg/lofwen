import * as reactNativeLogs from "react-native-logs";
import * as UiReactWithSchemas from "tinybase/ui-react/with-schemas";
import type {
  NoValuesSchema,
  ParameterizedCallback,
  Row,
  Table,
} from "tinybase/with-schemas";
import type { z } from "zod";
import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

const logger = reactNativeLogs.logger.createLogger().extend("TinyBaseEventLog");

/**
 * Event log implementation backed by a TinyBase store.
 */
export class TinyBaseEventLog<
  EventT extends BaseEvent,
> extends EventLog<EventT> {
  private readonly addRowCallback: ParameterizedCallback<EventT>;
  private readonly eventSchema: z.ZodType<EventT>;
  private readonly parsedRowCache: Record<string, EventT | null> = {};
  private readonly table: Table<typeof TinyBaseEventLog.tablesSchema, "event">;

  constructor({
    addRowCallback,
    eventSchema,
    table,
  }: {
    addRowCallback: ParameterizedCallback<EventT>;
    eventSchema: z.ZodType<EventT>;
    table: Table<typeof TinyBaseEventLog.tablesSchema, "event">;
  }) {
    super();
    this.addRowCallback = addRowCallback;
    this.eventSchema = eventSchema;
    this.table = table;
  }

  append(event: EventT): void {
    this.addRowCallback(event);
  }

  override *[Symbol.iterator](): Iterator<EventT> {
    for (const rowEntry of Object.entries(this.table)) {
      const event = this.parseRow(rowEntry[0], rowEntry[1]);
      if (event !== null) {
        yield event;
      }
    }
  }

  override get length(): number {
    return Object.values(this.table).length;
  }

  override *reverse(): Iterable<EventT> {
    const rowEntries = Object.entries(this.table);
    for (let rowI = rowEntries.length - 1; rowI >= 0; rowI--) {
      const rowEntry = rowEntries[rowI]!;
      const event = this.parseRow(rowEntry[0], rowEntry[1]);
      if (event !== null) {
        yield event;
      }
    }
  }

  private parseRow(
    rowId: string,
    row: Row<typeof TinyBaseEventLog.tablesSchema, "event", false>,
  ): EventT | null {
    {
      const entry = this.parsedRowCache[rowId];
      if (typeof entry !== "undefined") {
        return entry;
      }
    }

    const entryParseResult = this.eventSchema.safeParse(
      JSON.parse(row["json"] as string),
    );
    if (!entryParseResult.success) {
      logger.warn(
        "unable to parse event log row",
        rowId,
        "\n",
        entryParseResult.error,
        "\n",
        JSON.stringify(row),
      );
      return null;
    }
    const entry = entryParseResult.data;
    this.parsedRowCache[rowId] = entry;
    return entry;
  }
}

export namespace TinyBaseEventLog {
  export const UiReact = UiReactWithSchemas as UiReactWithSchemas.WithSchemas<
    [typeof tablesSchema, NoValuesSchema]
  >;

  export const tablesSchema = {
    event: {
      json: { type: "string" },
    },
  } as const;
}
