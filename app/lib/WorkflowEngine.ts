import type { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { logger } from "~/logger";
import type { Event, Log, RenderableAction } from "~/models";
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
      this.addLogEntry(event);

      logger.debug("invoking workflow");
      // log from the hook doesn't include the just-added event yet
      // Instead of looping back around to look for the event, temporarily concatenate it to the log for the benefit of the workflow.
      const nextAction = this.workflow({ event, log: this.log.concat(event) });
      this.addLogEntry(nextAction);

      switch (nextAction["@type"]) {
        case "AcknowledgmentAction":
        case "LikertScaleQuestionAction":
          return nextAction;
      }
    }
  }
}
