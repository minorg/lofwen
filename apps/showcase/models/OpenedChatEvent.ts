import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type OpenedChatEvent = z.infer<typeof OpenedChatEvent.schema>;

export namespace OpenedChatEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("OpenedChatEvent"),
    question: Question.schema,
  });
}
