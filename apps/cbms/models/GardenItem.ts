import type { MaterialIcons } from "@expo/vector-icons";
import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { Icon } from "~/models/Icon";

export type GardenItem = z.infer<typeof GardenItem.schema>;

export namespace GardenItem {
  export const schema = z.object({
    "@id": Identifier.schema,
    icon: Icon.schema,
    description: z.string(),
    name: z.string(),
    shortDescription: z.string(),
  });

  export type Icon = keyof typeof MaterialIcons.glyphMap;
}
