import { z } from "zod";
import { StartedAppEvent } from "~/models/StartedAppEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [StartedAppEvent.schema]);
}
