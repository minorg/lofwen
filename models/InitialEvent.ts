import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * Pseudo-event to kick off the workflow.
 */
export type InitialEvent = z.infer<typeof InitialEvent.schema>;

export namespace InitialEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("InitialEvent"),
  });
}
