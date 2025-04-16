import { z } from "zod";
import { ChatMessageSentEvent } from "~/models/ChatMessageSentEvent";
import { NotificationScheduledEvent } from "~/models/NotificationScheduledEvent";
import { QuestionAnsweredEvent } from "~/models/QuestionAnsweredEvent";
import { QuestionPosedEvent } from "~/models/QuestionPosedEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    ChatMessageSentEvent.schema,
    NotificationScheduledEvent.schema,
    QuestionAnsweredEvent.schema,
    QuestionPosedEvent.schema,
  ]);
}
