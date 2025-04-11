import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";
import { Notification } from "~/models/Notification";

export type ScheduleNotificationAction = z.infer<
  typeof ScheduleNotificationAction.schema
>;

export namespace ScheduleNotificationAction {
  export const schema = BaseAction.schema.extend({
    "@type": z.literal("ScheduleNotificationAction"),
    content: Notification.Content.schema,
    trigger: Notification.Trigger.schema.nullable(), // null trigger = schedule immediately
  });
}
