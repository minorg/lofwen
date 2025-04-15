import { useMemo } from "react";

import {
  ConcatenatedEventLog,
  EphemeralEventLog,
  type TinyBaseEventLog,
  useTinyBaseEventLog,
} from "@lofwen/event-log";
import { Timestamp } from "@lofwen/models";
import * as Notifications from "expo-notifications";
import { type Router, useRouter } from "expo-router";
import { Platform } from "react-native";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { Event } from "~/models/Event";
import type { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("WorkflowEngine");

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

export class WorkflowEngine {
  private readonly eventLog: TinyBaseEventLog<Event>;
  private readonly router: Router;

  constructor({
    eventLog,
    router,
  }: {
    eventLog: TinyBaseEventLog<Event>;
    router: Router;
  }) {
    this.eventLog = eventLog;
    this.router = router;
  }

  /**
   * On an event, invoke the workflow one or more times until it produces a renderable action.
   */
  async onEvent(event: Event): Promise<void> {
    // Keep new log entries in an array temporarily instead of invoking addLogEntry as the events emerge,
    // in order to eliminate downstream re-renders triggered by the log changing.
    const newEvents: Event[] = [];
    await this.onEventRecursive({
      event,
      newEvents,
    });
    for (const newEvent of newEvents) {
      this.eventLog.append(newEvent);
    }
  }

  private async onEventRecursive({
    event,
    newEvents,
  }: { event: Event; newEvents: Event[] }): Promise<void> {
    newEvents.push(event);

    logger.debug("invoking workflow");
    const nextAction = workflow({
      eventLog: new ConcatenatedEventLog(
        this.eventLog,
        new EphemeralEventLog(newEvents),
      ),
    });

    switch (nextAction["@type"]) {
      case "PoseQuestionAction": {
        this.router.push(Hrefs.question(nextAction.question));
        return;
      }
      case "ScheduleNotificationAction": {
        if (Platform.OS !== "web") {
          await this.scheduleNotification(nextAction);
        } else {
          logger.warn("notifications are not available on the web, ignoring");
        }

        return this.onEventRecursive({
          event: {
            "@type": "NotificationScheduledEvent",
            content: nextAction.content,
            timestamp: Timestamp.now(),
            trigger: nextAction.trigger,
          },
          newEvents,
        });
      }
    }
  }

  private async scheduleNotification(
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
}

export function useWorkflowEngine(): WorkflowEngine {
  const eventLog = useTinyBaseEventLog({ eventSchema: Event.schema });
  const router = useRouter();

  return useMemo(
    () => new WorkflowEngine({ eventLog, router }),
    [eventLog, router],
  );
}
