import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleAnswerEvent = z.infer<
  typeof LikertScaleAnswerEvent.schema
>;

export namespace LikertScaleAnswerEvent {
  export const schema = BaseEvent.schema.extend({
    eventType: z.literal("LikertScaleAnswerEvent"),
    responseCategory: OrdinalCategory.schema,
  });
}
