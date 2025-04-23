import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

/**
 * Event signifying that a user selected an item from the garden.
 */
export type SelectedGardenItemEvent = z.infer<
  typeof SelectedGardenItemEvent.schema
>;

export namespace SelectedGardenItemEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("SelectedGardenItemEvent"),
  });
}
