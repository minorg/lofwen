import { logger } from "~/logger";
import type { Log } from "~/models";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

export function useAddLogEntry() {
  const { useAddRowCallback } = SynchronizedStore.UiReact;
  return useAddRowCallback(
    "log",
    (logEntry: Log.Entry) => {
      const { "@type": type, timestamp, ...otherProperties } = logEntry;

      return {
        json: JSON.stringify(otherProperties),
        timestamp,
        type,
      };
    },
    undefined,
    undefined,
    (rowId, _store, row) =>
      logger.debug(`added log entry rowId=${rowId} row=${JSON.stringify(row)}`),
  );
}
