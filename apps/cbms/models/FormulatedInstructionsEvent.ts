import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Instructions } from "~/models/Instructions";

export type FormulatedInstructionsEvent = z.infer<
  typeof FormulatedInstructionsEvent.schema
>;

export namespace FormulatedInstructionsEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("FormulatedInstructionsEvent"),
    instructions: Instructions.schema,
  });
}
