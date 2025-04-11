import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { logger } from "~/logger";
import {
  Action,
  type Event,
  type Log,
  Notification,
  type RenderableAction,
  Timestamp,
} from "~/models";
import type { Workflow } from "~/workflows";

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
  private readonly log: Log;
  private readonly addLogEntry: ReturnType<typeof useAddLogEntry>;
  private readonly workflow: Workflow;

  constructor({
    addLogEntry,
    log,
    workflow,
  }: {
    addLogEntry: ReturnType<typeof useAddLogEntry>;
    log: Log;
    workflow: Workflow;
  }) {
    this.addLogEntry = addLogEntry;
    this.log = log;
    this.workflow = workflow;
  }

  /**
   * On an event, invoke the workflow one or more times until it produces a renderable action.
   */
  async onEvent(event: Event): Promise<RenderableAction> {
    // Keep new log entries in an array temporarily instead of invoking addLogEntry as the events emerge,
    // in order to eliminate downstream re-renders triggered by the log changing.
    const newLogEntries: Log.Entry[] = [];
    const nextAction = await this.onEventRecursive({
      event,
      newLogEntries,
    });
    for (const logEntry of newLogEntries) {
      this.addLogEntry(logEntry);
    }
    return nextAction;
  }

  private async onEventRecursive({
    event,
    newLogEntries,
  }: { event: Event; newLogEntries: Log.Entry[] }): Promise<RenderableAction> {
    const eventLogEntry: Log.EventEntry = {
      "@type": "EventEntry",
      event,
      timestamp: Timestamp.now(),
    };
    newLogEntries.push(eventLogEntry);

    logger.debug("invoking workflow");
    const nextAction = this.workflow({
      event,
      log: this.log.concat(...newLogEntries),
    });
    newLogEntries.push({
      "@type": "ActionEntry",
      action: nextAction,
      timestamp: Timestamp.now(),
    });

    if (Action.isRenderable(nextAction)) {
      return nextAction;
    }

    switch (nextAction["@type"]) {
      case "ScheduleNotificationAction": {
        if (Platform.OS !== "web") {
          logger.debug("scheduling notification");
          await Notifications.scheduleNotificationAsync({
            content: nextAction.content,
            trigger:
              nextAction.trigger !== null
                ? Notification.Trigger.toExpoNotificationTriggerInput(
                    nextAction.trigger,
                  )
                : null,
          });
          logger.debug("scheduled notification");
        } else {
          logger.warn("notifications are not available on the web, ignoring");
        }

        return this.onEventRecursive({
          event: {
            "@type": "ScheduledNotificationEvent",
            scheduleNotificationActionId: nextAction["@id"],
          },
          newLogEntries,
        });
      }
    }
  }
}
