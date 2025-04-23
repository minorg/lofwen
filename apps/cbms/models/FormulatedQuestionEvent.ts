import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

/**
 * Event that contains the Question in the event log.
 *
 * See notes in FormulateQuestionAction re: the action-event sequence.
 */
export type FormulatedQuestionEvent = z.infer<
  typeof FormulatedQuestionEvent.schema
>;

export namespace FormulatedQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("FormulatedQuestionEvent"),
    question: Question.schema,
  });
}
