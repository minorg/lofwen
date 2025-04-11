import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";

export type ScheduleNotificationAction = z.infer<
  typeof ScheduleNotificationAction.schema
>;

export namespace ScheduleNotificationAction {
  const baseTriggerSchema = z.object({
    channelId: z.string().optional(),
  });

  export const schema = BaseAction.schema.extend({
    "@type": z.literal("ScheduleNotificationAction"),
    content: z.object({
      // Adapted from expo-notifications NotificationContentInput
      // Skip attachments
      autoDismiss: z
        .boolean()
        .optional()
        .describe(
          "(Android) If set to `false`, the notification will not be automatically dismissed when clicked.",
        ),
      badge: z
        .number()
        .optional()
        .describe("Application badge number associated with the notification."),
      body: z
        .string()
        .optional()
        .describe("The main content of the notification."),
      categoryIdentifier: z
        .string()
        .optional()
        .describe("(iOS) The identifier of the notification's category"),
      color: z
        .string()
        .optional()
        .describe(
          "(Android) Accent color (in `#AARRGGBB` or `#RRGGBB` format) to be applied by the standard Style templates when presenting this notification.",
        ),
      interruptionLevel: z
        .enum(["passive", "active", "timeSensitive", "critical"])
        .optional()
        .describe(
          "(iOS) The notification’s importance and required delivery timing.",
        ),
      // Skip data
      priority: z
        .string()
        .optional()
        .describe(
          "(Android) Relative priority for this notification. Priority is an indication of how much of the user's valuable attention should be consumed by this notification. Low-priority notifications may be hidden from the user in certain situations, while the user might be interrupted for a higher-priority notification. The system will make a determination about how to interpret this priority when presenting the notification.",
        ),
      sound: z.union([z.boolean(), z.string()]).optional(),
      sticky: z
        .boolean()
        .optional()
        .describe(
          "(Android) If set to `true`, the notification cannot be dismissed by swipe.",
        ),
      subtitle: z.string().optional(),
      title: z
        .string()
        .optional()
        .describe("The bold text displayed above the rest of the content."),
      vibrate: z
        .array(z.number())
        .optional()
        .describe("(Android)The pattern with which to vibrate."),
    }),
    trigger: z
      .discriminatedUnion("type", [
        // Adapted from expo-notifications NotificationTriggerInput
        // Skip iOS-only "calendar"
        // All properties are specified in JavaScript `Date` object's ranges (i.e. January is represented as 0).
        baseTriggerSchema.extend({
          hour: z.number(),
          minute: z.number(),
          type: z.literal("daily"),
        }),
        baseTriggerSchema.extend({
          date: z.number(), // Don't support JavaScript Date since it's not JSON-serializable
          type: z.literal("date"),
        }),
        baseTriggerSchema.extend({
          day: z.number(),
          hour: z.number(),
          minute: z.number(),
          type: z.literal("monthly"),
        }),
        baseTriggerSchema.extend({
          repeats: z.boolean().optional(),
          seconds: z.number(),
          type: z.literal("timeInterval"),
        }),
        baseTriggerSchema.extend({
          hour: z.number(),
          minute: z.number(),
          type: z.literal("weekly"),
          weekday: z
            .number()
            .describe(
              "Weekdays are specified with a number from `1` through `7`, with `1` indicating Sunday.",
            ),
        }),
        baseTriggerSchema.extend({
          day: z.number(),
          hour: z.number(),
          minute: z.number(),
          month: z.number(),
          type: z.literal("yearly"),
        }),
      ])
      .nullable(), // null trigger = schedule immediately
  });
}
