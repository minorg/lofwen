import { z } from "zod";
import { ActionLogEntry } from "~/models/ActionLogEntry";
import { EventLogEntry } from "~/models/EventLogEntry";

export type LogEntry = z.infer<typeof LogEntry.schema>;

export namespace LogEntry {
  export const schema = z.union([ActionLogEntry.schema, EventLogEntry.schema]);
}
