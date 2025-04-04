import { z } from "zod";
import { Action } from "~/models/Action";
import { Event } from "~/models/Event";

export type LogEntry = z.infer<typeof LogEntry.schema>;

export namespace LogEntry {
  export const schema = z.union([Action.schema, Event.schema]);
}
