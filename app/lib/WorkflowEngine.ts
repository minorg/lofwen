import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { logger } from "~/logger";
import {
  Action,
  type Event,
  type EventLogEntry,
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
    const eventLogEntry: EventLogEntry = {
      "@type": "EventLogEntry",
      event,
      timestamp: Timestamp.now(),
    };
    this.addLogEntry(eventLogEntry);

    logger.debug("invoking workflow");
    // log from the hook doesn't include the just-added event yet
    // Instead of looping back around to look for the event, temporarily concatenate it to the log for the benefit of the workflow.
    const nextAction = this.workflow({
      event,
      log: this.log.concat(eventLogEntry),
    });
    this.addLogEntry({
      "@type": "ActionLogEntry",
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

        return this.onEvent({
          "@type": "ScheduledNotificationEvent",
          scheduleNotificationActionId: nextAction["@id"],
        });
      }
    }
  }
}
