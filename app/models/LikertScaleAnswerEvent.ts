import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Identifier } from "~/models/Identifier";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleAnswerEvent = z.infer<
  typeof LikertScaleAnswerEvent.schema
>;

export namespace LikertScaleAnswerEvent {
  export const schema = BaseEvent.schema.extend({
    questionActionId: Identifier.schema,
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("LikertScaleAnswerEvent"),
  });
}
