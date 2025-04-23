import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * Event signifying that a garden page was showed to the user.
 */
export type ShowedGardenEvent = z.infer<typeof ShowedGardenEvent.schema>;

export namespace ShowedGardenEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("ShowedGardenEvent"),
  });
}
