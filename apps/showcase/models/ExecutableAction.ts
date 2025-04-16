import type { TinyBaseEventLog } from "@lofwen/event-log";
import { Action } from "~/models/Action";
import type { Event } from "~/models/Event";

/**
 * An action that should be executed in a useEffect.
 *
 * Typically adds to the event log, possibly asynchronously.
 */
export abstract class ExecutableAction extends Action {
  abstract execute(parameters: {
    eventLog: TinyBaseEventLog<Event>;
  }): Promise<void>;
}
