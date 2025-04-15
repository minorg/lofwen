import { type TinyBaseEventLog, useTinyBaseEventLog } from "@lofwen/event-log";
import { Event } from "~/models/Event";

export function useEventLog(): TinyBaseEventLog<Event> {
  return useTinyBaseEventLog({ eventSchema: Event.schema });
}
