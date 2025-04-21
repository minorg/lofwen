import { Timestamp } from "@lofwen/models";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import type { Instructions } from "~/models/Instructions";

export class FormulateInstructionsAction extends ExecutableAction {
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
