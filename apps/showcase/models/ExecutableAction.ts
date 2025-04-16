import type { TinyBaseEventLog } from "@lofwen/event-log";
import { Action } from "~/models/Action";
import type { Event } from "~/models/Event";

export abstract class ExecutableAction extends Action {
  abstract execute(parameters: {
    eventLog: TinyBaseEventLog<Event>;
  }): Promise<void>;
}
