import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type QuestionFormulatedEvent = z.infer<
  typeof QuestionFormulatedEvent.schema
>;

export namespace QuestionFormulatedEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("QuestionFormulatedEvent"),
    question: Question.schema,
  });
}
