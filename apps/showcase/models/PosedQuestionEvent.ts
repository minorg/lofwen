import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type PosedQuestionEvent = z.infer<typeof PosedQuestionEvent.schema>;

export namespace PosedQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("PosedQuestionEvent"),
    question: Question.schema,
  });
}
