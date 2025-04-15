import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type NotificationScheduledEvent = z.infer<
  typeof NotificationScheduledEvent.schema
>;

export namespace NotificationScheduledEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("NotificationScheduledEvent"),
    scheduleNotificationActionId: Identifier.schema,
  });
}
