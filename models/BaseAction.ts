import { z } from "zod";
import { BaseLogEntry } from "~/models/BaseLogEntry";
import { Identifier } from "~/models/Identifier";

export type BaseAction = z.infer<typeof BaseAction.schema>;

export namespace BaseAction {
  export const schema = BaseLogEntry.schema.extend({
    logEntryType: z.literal("Action"),
    triggerEventIdentifier: Identifier.schema,
  });
}
