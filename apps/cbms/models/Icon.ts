import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { z } from "zod";

export type Icon = z.infer<typeof Icon.schema>;

export namespace Icon {
  function typedObjectKeys<T extends object>(object: T) {
    return Object.keys(object) as (keyof typeof object)[];
  }

  const materialCommunityIconNames = typedObjectKeys(
    MaterialCommunityIcons.glyphMap,
  );
  const materialIconNames = typedObjectKeys(MaterialIcons.glyphMap);

  export const schema = z.discriminatedUnion("family", [
    z.object({
      family: z.literal("FontAwesome6"),
      name: z.string(),
    }),
    z.object({
      family: z.literal("MaterialCommunityIcons"),
      name: z.enum([
        materialCommunityIconNames[0],
        ...materialCommunityIconNames.slice(1),
      ]),
    }),
    z.object({
      family: z.literal("MaterialIcons"),
      name: z.enum([materialIconNames[0], ...materialIconNames.slice(1)]),
    }),
  ]);

  export type Icon = keyof typeof MaterialIcons.glyphMap;
}
