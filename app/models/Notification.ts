import {
  type DailyTriggerInput,
  type DateTriggerInput,
  type MonthlyTriggerInput,
  type NotificationTriggerInput,
  SchedulableTriggerInputTypes,
  type TimeIntervalTriggerInput,
  type WeeklyTriggerInput,
  type YearlyTriggerInput,
} from "expo-notifications";
import { z } from "zod";

export namespace Notification {
  export type Content = z.infer<typeof Content.schema>;

  export namespace Content {
    export const schema = z.object({
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
    });
  }

  export type Trigger = z.infer<typeof Trigger.schema>;

  export namespace Trigger {
    const baseSchema = z.object({
      channelId: z.string().optional(),
    });

    export const schema = z.discriminatedUnion("type", [
      // Adapted from expo-notifications NotificationTriggerInput
      // Skip iOS-only "calendar"
      // All properties are specified in JavaScript `Date` object's ranges (i.e. January is represented as 0).
      baseSchema.extend({
        hour: z.number(),
        minute: z.number(),
        type: z.literal("daily"),
      }),
      baseSchema.extend({
        date: z.number(), // Don't support JavaScript Date since it's not JSON-serializable
        type: z.literal("date"),
      }),
      baseSchema.extend({
        day: z.number(),
        hour: z.number(),
        minute: z.number(),
        type: z.literal("monthly"),
      }),
      baseSchema.extend({
        repeats: z.boolean().optional(),
        seconds: z.number(),
        type: z.literal("timeInterval"),
      }),
      baseSchema.extend({
        hour: z.number(),
        minute: z.number(),
        type: z.literal("weekly"),
        weekday: z
          .number()
          .describe(
            "Weekdays are specified with a number from `1` through `7`, with `1` indicating Sunday.",
          ),
      }),
      baseSchema.extend({
        day: z.number(),
        hour: z.number(),
        minute: z.number(),
        month: z.number(),
        type: z.literal("yearly"),
      }),
    ]);

    export function toExpoNotificationTriggerInput(
      trigger: Notification.Trigger,
    ): NotificationTriggerInput {
      // This madness is due to expo-notifications using a native enum for the type discriminator, which Zod can't really handle.
      switch (trigger.type) {
        case "daily": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.DAILY,
          } satisfies DailyTriggerInput;
        }
        case "date": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.DATE,
          } satisfies DateTriggerInput;
        }
        case "monthly": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.MONTHLY,
          } satisfies MonthlyTriggerInput;
        }
        case "timeInterval": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          } satisfies TimeIntervalTriggerInput;
        }
        case "weekly": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.WEEKLY,
          } satisfies WeeklyTriggerInput;
        }
        case "yearly": {
          const { type, ...otherProps } = trigger;
          return {
            ...otherProps,
            type: SchedulableTriggerInputTypes.YEARLY,
          } satisfies YearlyTriggerInput;
        }
      }
    }
  }
}
