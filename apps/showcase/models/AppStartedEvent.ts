import {} from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type AppStartedEvent = z.infer<typeof AppStartedEvent.schema>;

export namespace AppStartedEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("AppStartedEvent"),
  });
}
