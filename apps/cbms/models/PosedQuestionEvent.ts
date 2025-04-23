import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * Event signifying that a question was posed to the user by the question page.
 *
 * See notes in FormulateQuestionAction re: the action-event sequence.
 */
export type PosedQuestionEvent = z.infer<typeof PosedQuestionEvent.schema>;

export namespace PosedQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("PosedQuestionEvent"),
    questionId: Identifier.schema,
  });
}
