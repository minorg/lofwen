import { MaterialIcons } from "@expo/vector-icons";
import { Identifier } from "@lofwen/models";
import { z } from "zod";

export type GardenItem = z.infer<typeof GardenItem.schema>;

export namespace GardenItem {
  export const schema = z.object({
    "@id": Identifier.schema,
    // @ts-ignore
    icon: z.enum(Object.keys(MaterialIcons.glyphMap)),
    text: z.string(),
  });
}
