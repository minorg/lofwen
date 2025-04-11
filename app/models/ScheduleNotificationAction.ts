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
    identifier: z
      .string()
      .optional()
      .describe(
        "unique identifier -- if set, will overwrite an existing notification with that identifier",
      ),
    trigger: Notification.Trigger.schema
      .nullable()
      .describe("trigger -- null means schedule immediately"),
  });
}
