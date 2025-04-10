import type { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { logger } from "~/logger";
import {
  type Event,
  type EventLogEntry,
  type Log,
  type RenderableAction,
  Timestamp,
} from "~/models";
import type { Workflow } from "~/workflows";

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
  onEvent(event: Event): RenderableAction {
    for (;;) {
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

      switch (nextAction["@type"]) {
        case "AcknowledgmentAction":
        case "LikertScaleQuestionAction":
          return nextAction;
      }
    }
  }
}
