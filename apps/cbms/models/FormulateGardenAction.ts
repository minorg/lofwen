import { Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import type { Garden } from "~/models/Garden";

/**
 * Action to add a FormulatedGardenEvent to the event log.
 *
 * The action-event sequence is as follows:
 * 1. FormulateGardenAction: add an Garden to the event log for subsequent use by #2 and #3.
 * 2. FormulatedGardenEvent
 * 3. ShowGardenAction: redirect to the garden page.
 * 4. ShowedGardenEvent.
 * 5. SelectedGardenItemEvent.
 */
export class FormulateGardenAction extends Action {
  readonly garden: Garden;

  constructor({ garden }: { garden: Garden }) {
    super();
    this.garden = garden;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "FormulatedGardenEvent",
      garden: this.garden,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `FormulateGardenAction(garden=${JSON.stringify(this.garden)}))`;
  }
}
