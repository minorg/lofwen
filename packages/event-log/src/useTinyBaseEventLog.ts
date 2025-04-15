import { useMemo } from "react";
import * as reactNativeLogs from "react-native-logs";
import type { z } from "zod";
import type { BaseEvent } from "./BaseEvent";
import type { EventLog } from "./EventLog";
import { TinyBaseEventLog } from "./TinyBaseEventLog";

const logger = reactNativeLogs.logger.createLogger().extend("TinyBaseEventLog");

export function useTinyBaseEventLog<EventT extends BaseEvent>({
  eventSchema,
}: {
  eventSchema: z.ZodType<EventT>;
}): TinyBaseEventLog<EventT> {
  const { useAddRowCallback, useTable } = TinyBaseEventLog.UiReact;
  const table = useTable("log");
  const addRowCallback = useAddRowCallback(
    "log",
    (logEntry: EventLog.Entry<EventT>) => {
      const { timestamp, ...otherProperties } = logEntry;

      return {
        json: JSON.stringify(otherProperties),
        timestamp,
      };
    },
    undefined,
    undefined,
    (rowId, _store, row) =>
      logger.debug(`added log entry rowId=${rowId} row=${JSON.stringify(row)}`),
  );
  return useMemo(
    () => new TinyBaseEventLog({ addRowCallback, eventSchema, table }),
    [addRowCallback, eventSchema, table],
  );
}
