import { useMemo } from "react";
import type { z } from "zod";
import type { BaseEvent } from "./BaseEvent";
import { TinyBaseEventLog } from "./TinyBaseEventLog";

export function useTinyBaseEventLog<EventT extends BaseEvent>({
  eventSchema,
  logger,
}: {
  eventSchema: z.ZodType<EventT>;
  logger: {
    debug: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
  };
}): TinyBaseEventLog<EventT> {
  const { useAddRowCallback, useTable } = TinyBaseEventLog.UiReact;
  const table = useTable("event");
  const addRowCallback = useAddRowCallback(
    "event",
    (event: EventT) => {
      return {
        json: JSON.stringify(event),
      };
    },
    undefined,
    undefined,
    (rowId, _store, row) =>
      logger.debug(`added event rowId=${rowId} row=${JSON.stringify(row)}`),
  );
  return useMemo(
    () => new TinyBaseEventLog({ addRowCallback, eventSchema, logger, table }),
    [addRowCallback, eventSchema, logger, table],
  );
}
