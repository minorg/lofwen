import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type GaveInstructionsEvent = z.infer<
  typeof GaveInstructionsEvent.schema
>;

export namespace GaveInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("GaveInstructionsEvent"),
    instructionsId: Identifier.schema,
  });
}
