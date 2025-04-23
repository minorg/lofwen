import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Instructions } from "~/models/Instructions";

/**
 * Event that contains the Instructions in the event log.
 *
 * See notes in FormulateInstructionsAction re: the action-event sequence.
 */
export type FormulatedInstructionsEvent = z.infer<
  typeof FormulatedInstructionsEvent.schema
>;

export namespace FormulatedInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("FormulatedInstructionsEvent"),
    instructions: Instructions.schema,
  });
}
