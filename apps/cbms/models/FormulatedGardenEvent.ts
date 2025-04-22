import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Garden } from "~/models/Garden";

/**
 * Event that contains the Garden in the event log.
 *
 * See notes in FormulateGardenAction re: the action-event sequence.
 */
export type FormulatedGardenEvent = z.infer<
  typeof FormulatedGardenEvent.schema
>;

export namespace FormulatedGardenEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("FormulatedGardenEvent"),
    garden: Garden.schema,
  });
}
