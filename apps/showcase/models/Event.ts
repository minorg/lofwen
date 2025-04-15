import { z } from "zod";
import { NotificationScheduledEvent } from "~/models/NotificationScheduledEvent";
import { QuestionAnsweredEvent } from "~/models/QuestionAnsweredEvent";
import { QuestionFormulatedEvent } from "~/models/QuestionFormulatedEvent";
import { QuestionPosedEvent } from "~/models/QuestionPosedEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    NotificationScheduledEvent.schema,
    QuestionAnsweredEvent.schema,
    QuestionFormulatedEvent.schema,
    QuestionPosedEvent.schema,
  ]);
}
