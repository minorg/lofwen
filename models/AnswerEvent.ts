import { z } from "zod";
import { Answer } from "~/models/Answer";
import { BaseEvent } from "~/models/BaseEvent";
import { Identifier } from "~/models/Identifier";

export type AnswerEvent = z.infer<typeof AnswerEvent.schema>;

export namespace AnswerEvent {
  export const schema = BaseEvent.schema.extend({
    answer: Answer.schema,
    eventType: z.literal("AnswerEvent"),
    questionActionIdentifier: Identifier.schema,
  });
}
