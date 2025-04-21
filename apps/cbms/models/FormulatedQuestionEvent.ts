import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type FormulatedQuestionEvent = z.infer<
  typeof FormulatedQuestionEvent.schema
>;

export namespace FormulatedQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("FormulatedQuestionEvent"),
    question: Question.schema,
  });
}
