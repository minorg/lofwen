import { Identifier } from "@lofwen/models";
import { z } from "zod";
import images from "~/assets/images";

export type Instructions = z.infer<typeof Instructions.schema>;

export namespace Instructions {
  export const schema = z.object({
    "@id": Identifier.schema,
    "@type": z.literal("Instructions"),
    image: z
      .custom<keyof typeof images>((key) =>
        Object.keys(images).includes(key as string),
      )
      .optional(),
    text: z.string().optional(),
    title: z.string(),
  });
}
