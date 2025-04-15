import { Identifier, Notification } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type NotificationScheduledEvent = z.infer<
  typeof NotificationScheduledEvent.schema
>;

export namespace NotificationScheduledEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("NotificationScheduledEvent"),
    content: Notification.Content.schema,
    identifier: Identifier.schema.optional(),
    trigger: Notification.Trigger.schema.nullable(),
  });
}
