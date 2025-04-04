import {} from "tinybase/ui-react";
import { Store } from "~/Store";
import type { LogEntry } from "~/models";

export function useAddLogEntry() {
  const { useSetRowCallback } = Store.UiReact;
  return useSetRowCallback(
    "log",
    (logEntry: LogEntry) => logEntry.identifier,
    (logEntry: LogEntry) => {
      const {
        identifier,
        logEntryType: type,
        timestamp,
        ...otherProperties
      } = logEntry;

      return {
        identifier,
        json: JSON.stringify(otherProperties),
        timestamp,
        type,
      };
    },
  );
}
