import type { EventLog } from "@lofwen/event-log";
import type { Event } from "~/models/Event";

export interface Action {
  execute(parameters: { eventLog: EventLog<Event> }): Promise<void>;
}
