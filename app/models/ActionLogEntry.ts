import { z } from "zod";
import { Action } from "~/models/Action";
import { BaseLogEntry } from "~/models/BaseLogEntry";

export type ActionLogEntry = z.infer<typeof ActionLogEntry.schema>;

export namespace ActionLogEntry {
  export const schema = BaseLogEntry.schema.extend({
    "@type": z.literal("ActionLogEntry"),
    action: Action.schema,
  });
}
