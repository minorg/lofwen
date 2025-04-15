import * as reactNativeLogs from "react-native-logs";
import * as UiReactWithSchemas from "tinybase/ui-react/with-schemas";
import type {
  NoValuesSchema,
  ParameterizedCallback,
  Row,
  Table,
  TablesSchema,
} from "tinybase/with-schemas";
import { z } from "zod";
import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

const logger = reactNativeLogs.logger.createLogger().extend("TinyBaseEventLog");

/**
 * Log implementation backed by a TinyBase store.
 */
export class TinyBaseEventLog<
  EventT extends BaseEvent,
> extends EventLog<EventT> {
  private readonly addRowCallback: ParameterizedCallback<
    EventLog.Entry<EventT>
  >;
  private readonly entrySchema: z.ZodType<EventLog.Entry<EventT>>;
  private readonly parsedRowCache: Record<
    string,
    EventLog.Entry<EventT> | null
  > = {};
  private readonly table: Table<typeof TinyBaseEventLog.tablesSchema, "log">;

  constructor({
    addRowCallback,
    eventSchema,
    table,
  }: {
    addRowCallback: ParameterizedCallback<EventLog.Entry<EventT>>;
    eventSchema: z.ZodType<EventT>;
    table: Table<typeof TinyBaseEventLog.tablesSchema, "log">;
  }) {
    super();
    this.addRowCallback = addRowCallback;
    // @ts-ignore
    this.entrySchema = z.object({
      event: eventSchema,
      timestamp: z.number(),
    });
    this.table = table;
  }

  addEvent(event: EventT): void {
    this.addRowCallback({
      event,
      timestamp: Date.now(),
    });
  }

  override *entries(): Iterable<EventLog.Entry<EventT>> {
    for (const rowEntry of Object.entries(this.table)) {
      const entry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (entry !== null) {
        yield entry;
      }
    }
  }

  override get length(): number {
    return Object.values(this.table).length;
  }

  override *reverseEntries(): Iterable<EventLog.Entry<EventT>> {
    const rowEntries = Object.entries(this.table);
    for (let rowI = rowEntries.length - 1; rowI >= 0; rowI--) {
      const rowEntry = rowEntries[rowI]!;
      const entry = this.parseRow(rowEntry[0], rowEntry[1]);
      if (entry !== null) {
        yield entry;
      }
    }
  }

  private parseRow(
    rowId: string,
    row: Row<typeof TinyBaseEventLog.tablesSchema, "log", false>,
  ): EventLog.Entry<EventT> | null {
    {
      const entry = this.parsedRowCache[rowId];
      if (typeof entry !== "undefined") {
        return entry;
      }
    }

    const jsonCellParsed = JSON.parse(row["json"] as string);
    const entryJsonObject = {
      "@type": row["type"],
      timestamp: row["timestamp"],
      ...jsonCellParsed,
    };
    const entryParseResult = this.entrySchema.safeParse(entryJsonObject);
    if (!entryParseResult.success) {
      logger.warn(
        "unable to parse log row",
        rowId,
        "\n",
        entryParseResult.error,
        "\n",
        JSON.stringify(row),
        "\n",
        JSON.stringify(entryJsonObject),
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

  export const tablesSchema: TablesSchema = {
    log: {
      json: { type: "string" },
      timestamp: { type: "number" },
      type: { type: "string" },
    },
  } as const;
}
