import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type AcknowledgedInstructionsEvent = z.infer<
  typeof AcknowledgedInstructionsEvent.schema
>;

export namespace AcknowledgedInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("AcknowledgedInstructionsEvent"),
    instructionsId: Identifier.schema,
  });
}
