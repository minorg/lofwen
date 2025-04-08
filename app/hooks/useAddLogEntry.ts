import {} from "tinybase/ui-react";
import { logger } from "~/logger";
import type { LogEntry } from "~/models";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

export function useAddLogEntry() {
  const { useSetRowCallback } = SynchronizedStore.UiReact;
  return useSetRowCallback(
    "log",
    (logEntry: LogEntry) => logEntry["@id"],
    (logEntry: LogEntry) => {
      const {
        "@id": id,
        "@timestamp": timestamp,
        "@type": type,
        ...otherProperties
      } = logEntry;

      return {
        id,
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
