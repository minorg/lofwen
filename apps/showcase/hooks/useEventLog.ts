import { type TinyBaseEventLog, useTinyBaseEventLog } from "@lofwen/event-log";
import { Event } from "~/models/Event";
import { rootLogger } from "~/rootLogger";

export function useEventLog(): TinyBaseEventLog<Event> {
  return useTinyBaseEventLog({ eventSchema: Event.schema, logger: rootLogger });
}
