import { useTinyBaseEventLog } from "@lofwen/event-log";
import { Event } from "~/models/Event";
import type { EventLog } from "~/models/EventLog";
import { rootLogger } from "~/rootLogger";

export function useEventLog(): EventLog {
  return useTinyBaseEventLog({ eventSchema: Event.schema, logger: rootLogger });
}
