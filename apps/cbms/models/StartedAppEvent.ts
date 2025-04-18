import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type StartedAppEvent = z.infer<typeof StartedAppEvent.schema>;

export namespace StartedAppEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("StartedAppEvent"),
  });
}
