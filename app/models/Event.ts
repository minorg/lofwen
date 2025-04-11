import { z } from "zod";
import { InitialEvent } from "~/models/InitialEvent";
import { LikertScaleAnswerEvent } from "~/models/LikertScaleAnswerEvent";
import { ScheduledNotificationEvent } from "~/models/ScheduledNotificationEvent";
import { TextAnswerEvent } from "~/models/TextAnswerEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    InitialEvent.schema,
    LikertScaleAnswerEvent.schema,
    ScheduledNotificationEvent.schema,
    TextAnswerEvent.schema,
  ]);
}
