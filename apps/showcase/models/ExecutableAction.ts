import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";

/**
 * An action that should be executed in a useEffect.
 *
 * Typically adds to the event log, possibly asynchronously.
 */
export abstract class ExecutableAction extends Action {
  abstract execute(parameters: {
    eventLog: EventLog;
  }): Promise<void>;
}
