import type { Identifier, Notification } from "@lofwen/models";

export interface ScheduleNotificationAction {
  readonly content: Notification.Content;
  readonly identifier?: Identifier;
  readonly "@type": "ScheduleNotificationAction";
  readonly trigger: Notification.Trigger | null; // null = schedule immediately
}
