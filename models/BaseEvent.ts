import type { z } from "zod";
import { BaseLogEntry } from "~/models/BaseLogEntry";

export type BaseEvent = z.infer<typeof BaseEvent.schema>;

export namespace BaseEvent {
  export const schema = BaseLogEntry.schema.extend({});
}
