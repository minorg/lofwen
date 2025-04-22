import { z } from "zod";
import { GardenItem } from "~/models/GardenItem";

export type Garden = z.infer<typeof Garden.schema>;

export namespace Garden {
  export const schema = z.object({
    items: z.array(GardenItem.schema),
  });
}
