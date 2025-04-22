import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { Answer } from "~/models/Answer";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * The user answered a question.
 *
 * See notes in FormulateQuestionAction re: the action-event sequence.
 */
export type AnsweredQuestionEvent = z.infer<
  typeof AnsweredQuestionEvent.schema
>;

export namespace AnsweredQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("AnsweredQuestionEvent"),
    answer: Answer.schema,
    questionId: Identifier.schema,
  });
}
