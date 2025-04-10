import { z } from "zod";
import { BaseLogEntry } from "~/models/BaseLogEntry";
import { Event } from "~/models/Event";

export type EventLogEntry = z.infer<typeof EventLogEntry.schema>;

export namespace EventLogEntry {
  export const schema = BaseLogEntry.schema.extend({
    "@type": z.literal("EventLogEntry"),
    event: Event.schema,
  });
}
