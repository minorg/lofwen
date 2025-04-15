import { z } from "zod";
import { Answer } from "~/models/Answer";
import { BaseEvent } from "~/models/BaseEvent";

export type QuestionAnsweredEvent = z.infer<
  typeof QuestionAnsweredEvent.schema
>;

export namespace QuestionAnsweredEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("QuestionAnsweredEvent"),
    answer: Answer.schema,
  });
}
