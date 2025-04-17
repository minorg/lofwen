import { z } from "zod";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";
import { ScheduledNotificationEvent } from "~/models/ScheduledNotificationEvent";
import { SentChatMessageEvent } from "~/models/SentChatMessageEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AnsweredQuestionEvent.schema,
    PosedQuestionEvent.schema,
    ScheduledNotificationEvent.schema,
    SentChatMessageEvent.schema,
  ]);
}
