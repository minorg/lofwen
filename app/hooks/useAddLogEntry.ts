import { logger } from "~/logger";
import type { LogEntry } from "~/models";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

export function useAddLogEntry() {
  const { useAddRowCallback } = SynchronizedStore.UiReact;
  return useAddRowCallback(
    "log",
    (logEntry: LogEntry) => {
      const { "@type": type, timestamp, ...otherProperties } = logEntry;

      return {
        json: JSON.stringify(otherProperties),
        timestamp,
        type,
      };
    },
    undefined,
    undefined,
    (_, row) => logger.debug("added log entry", JSON.stringify(row)),
  );
}
