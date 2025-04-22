import { Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import type { Instructions } from "~/models/Instructions";

/**
 * Action to add a FormulatedInstructionsEvent to the event log.
 *
 * The action-event sequence is as follows:
 * 1. FormulateInstructionsAction: add an Instructions to the event log for subsequent use by #2 and #3.
 * 2. FormulatedInstructionsEvent
 * 3. GiveInstructionsAction: redirect to the instructions page. The redirect URL can't contain the full instructions, only the id,
 *   which is used by the page to locate the the FormulateInstructionsAction with the actual Instructions.
 * 4. GaveInstructionsEvent.
 * 5. AcknowledgedInstructionsEvent.
 */
export class FormulateInstructionsAction extends Action {
  readonly instructions: Instructions;

  constructor({ instructions }: { instructions: Instructions }) {
    super();
    this.instructions = instructions;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "FormulatedInstructionsEvent",
      instructions: this.instructions,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `FormulateInstructionsAction(instructions=(@id=${this.instructions["@id"]}))`;
  }
}
