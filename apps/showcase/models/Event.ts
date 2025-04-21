import { z } from "zod";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { FormulatedQuestionEvent } from "~/models/FormulatedQuestionEvent";
import { OpenedChatEvent } from "~/models/OpenedChatEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";
import { ScheduledNotificationEvent } from "~/models/ScheduledNotificationEvent";
import { SentChatMessageEvent } from "~/models/SentChatMessageEvent";
import { StartedAppEvent } from "~/models/StartedAppEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AnsweredQuestionEvent.schema,
    OpenedChatEvent.schema,
    FormulatedQuestionEvent.schema,
    PosedQuestionEvent.schema,
    ScheduledNotificationEvent.schema,
    SentChatMessageEvent.schema,
    StartedAppEvent.schema,
  ]);
}
