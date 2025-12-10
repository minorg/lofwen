import { type Identifier, type Notification, Timestamp } from "@lofwen/models";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import type { ScheduledNotificationEvent } from "~/models/ScheduledNotificationEvent";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("executeAction");

Notifications.setNotificationHandler({
  handleNotification: async (notification: Notifications.Notification) => {
    logger.debug("handling notification:", JSON.stringify(notification));
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    };
  },
});

export class ScheduleNotificationAction extends ExecutableAction {
  readonly content: Notification.Content;
  readonly identifier?: Identifier;
  readonly trigger: Notification.Trigger | null;

  constructor({
    content,
    identifier,
    trigger,
  }: {
    content: Notification.Content;
    identifier?: Identifier;
    trigger?: Notification.Trigger;
  }) {
    super();
    this.content = content;
    this.identifier = identifier;
    this.trigger = trigger ?? null;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    const notificationScheduledEvent: ScheduledNotificationEvent = {
      "@type": "ScheduledNotificationEvent",
      content: this.content,
      timestamp: Timestamp.now(),
      trigger: this.trigger,
    };
    logger.debug("getting notification permissions status");
    const { status: existingNotificationPermissionsStatus } =
      await Notifications.getPermissionsAsync();
    logger.debug(
      "existing notification permissions status:",
      existingNotificationPermissionsStatus,
    );

    if (existingNotificationPermissionsStatus !== "granted") {
      logger.debug("requesting notification permissions");
      const { status: newNotificationPermissionsStatus } =
        await Notifications.requestPermissionsAsync();
      logger.debug(
        "new notification permissions status:",
        newNotificationPermissionsStatus,
      );

      if (newNotificationPermissionsStatus !== "granted") {
        logger.warn(
          "did not get permission for notifications:",
          newNotificationPermissionsStatus,
        );
        return;
      }

      // This code is needed for Android to work
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    }

    logger.debug("scheduling notification");
    await Notifications.scheduleNotificationAsync({
      content: this.content,
      identifier: this.identifier,
      trigger: this.trigger as Notifications.NotificationTriggerInput | null,
    });
    logger.debug("scheduled notification");

    eventLog.append(notificationScheduledEvent);
  }

  override toString(): string {
    return `ScheduleNotificationAction(identifier=${this.identifier})`;
  }
}
