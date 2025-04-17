import { Identifier, Notification } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type ScheduledNotificationEvent = z.infer<
  typeof ScheduledNotificationEvent.schema
>;

export namespace ScheduledNotificationEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("ScheduledNotificationEvent"),
    content: Notification.Content.schema,
    identifier: Identifier.schema.optional(),
    trigger: Notification.Trigger.schema.nullable(),
  });
}
