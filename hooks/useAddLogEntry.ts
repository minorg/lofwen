import {} from "tinybase/ui-react";
import { Store } from "~/Store";
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
        json: JSON.stringify(otherProperties),
        timestamp,
        type,
      };
    },
  );
}
