import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * The user acknowledged instructions.
 *
 * See notes in FormulateInstructionsAction re: the action-event sequence.
 */
export type AcknowledgedInstructionsEvent = z.infer<
  typeof AcknowledgedInstructionsEvent.schema
>;

export namespace AcknowledgedInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("AcknowledgedInstructionsEvent"),
    instructionsId: Identifier.schema,
  });
}
