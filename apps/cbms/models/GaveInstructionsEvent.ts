import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Instructions } from "~/models/Instructions";

export type GaveInstructionsEvent = z.infer<
  typeof GaveInstructionsEvent.schema
>;

export namespace GaveInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("GaveInstructionsEvent"),
    instructions: Instructions.schema,
  });
}
