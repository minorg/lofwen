import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Identifier } from "~/models/Identifier";

export type ScheduledNotificationEvent = z.infer<
  typeof ScheduledNotificationEvent.schema
>;

export namespace ScheduledNotificationEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("ScheduledNotificationEvent"),
    scheduleNotificationActionId: Identifier.schema,
  });
}
