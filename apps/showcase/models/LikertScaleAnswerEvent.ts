import { z } from "zod";
import { BaseAnswerEvent } from "~/models/BaseAnswerEvent";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleAnswerEvent = z.infer<
  typeof LikertScaleAnswerEvent.schema
>;

export namespace LikertScaleAnswerEvent {
  export const schema = BaseAnswerEvent.schema.extend({
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("LikertScaleAnswerEvent"),
  });
}
