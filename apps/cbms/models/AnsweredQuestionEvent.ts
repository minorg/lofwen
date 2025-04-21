import { z } from "zod";
import { Answer } from "~/models/Answer";
import { BaseEvent } from "~/models/BaseEvent";

export type AnsweredQuestionEvent = z.infer<
  typeof AnsweredQuestionEvent.schema
>;

export namespace AnsweredQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("AnsweredQuestionEvent"),
    answer: Answer.schema,
  });
}
