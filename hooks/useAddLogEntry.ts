import {} from "tinybase/ui-react";
import { Store } from "~/Store";
import { logger } from "~/logger";
import type { LogEntry } from "~/models";

export function useAddLogEntry() {
  const { useSetRowCallback } = Store.UiReact;
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
