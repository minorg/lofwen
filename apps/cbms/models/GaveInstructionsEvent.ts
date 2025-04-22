import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * Event signifying that the instructions were given to the user by the instructions page.
 *
 * See notes in FormulateInstructionsAction re: the action-event sequence.
 */
export type GaveInstructionsEvent = z.infer<
  typeof GaveInstructionsEvent.schema
>;

export namespace GaveInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("GaveInstructionsEvent"),
    instructionsId: Identifier.schema,
  });
}
