import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type QuestionPosedEvent = z.infer<typeof QuestionPosedEvent.schema>;

export namespace QuestionPosedEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("QuestionPosedEvent"),
    question: Question.schema,
  });
}
