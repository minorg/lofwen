import { z } from "zod";
import { Event } from "~/models/Event";
import { Identifier } from "~/models/Identifier";
import { Timestamp } from "~/models/Timestamp";

export type BaseAction = z.infer<typeof BaseAction.schema>;

export namespace BaseAction {
  export const schema = z.object({
    identifier: Identifier.schema,
    timestamp: Timestamp.schema,
    triggerEvent: Event.schema,
  });
}
