import type { TinyBaseEventLog } from "@lofwen/event-log";
import { Timestamp } from "@lofwen/models";
import * as Notifications from "expo-notifications";
import { Redirect } from "expo-router";
import type { ReactElement } from "react";
import { Platform } from "react-native";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";
import type { NotificationScheduledEvent } from "~/models/NotificationScheduledEvent";
import type { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("executeAction");

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notifications.Notification) => {
      logger.debug("handling notification:", JSON.stringify(notification));
      return {
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });
}

async function scheduleNotification(
  action: ScheduleNotificationAction,
): Promise<void> {
  invariant(Platform.OS !== "web");

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
    content: action.content,
    identifier: action.identifier,
    trigger: action.trigger as Notifications.NotificationTriggerInput | null,
  });
  logger.debug("scheduled notification");
}

/**
 * Execute an action.
 *
 * This function must either:
 * (1) Return a React element to render, typically a <Redirect>
 * (2) Add to the event log so the function will be triggered again.
 * The latter can happen asynchronously.
 */
export function executeAction({
  action,
  eventLog,
}: {
  action: Action;
  eventLog: TinyBaseEventLog<Event>;
}): ReactElement | null {
  logger.debug("executing", action["@type"]);

  switch (action["@type"]) {
    case "NopAction":
      return null;
    case "PoseQuestionAction": {
      eventLog.append({
        "@type": "QuestionFormulatedEvent",
        question: action.question,
        timestamp: Timestamp.now(),
      });
      logger.debug("executed", action["@type"], ", redirecting to question");
      return <Redirect href={Hrefs.question(action.question)} />;
    }
    case "ScheduleNotificationAction": {
      const { "@type": type, ...actionProps } = action;
      const notificationScheduledEvent: NotificationScheduledEvent = {
        "@type": "NotificationScheduledEvent",
        timestamp: Timestamp.now(),
        ...actionProps,
      };
      if (Platform.OS !== "web") {
        scheduleNotification(action).then(() => {
          eventLog.append(notificationScheduledEvent);
        });
      } else {
        logger.warn("notifications are not available on the web, ignoring");
        eventLog.append(notificationScheduledEvent);
      }
      return null;
    }
  }
}
