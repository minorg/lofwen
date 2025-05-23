import { Identifier } from "@lofwen/models";
import { z } from "zod";

export type Instructions = z.infer<typeof Instructions.schema>;

export namespace Instructions {
  export const schema = z.object({
    "@id": Identifier.schema,
    "@type": z.literal("Instructions"),
    text: z.string(),
    title: z.string(),
  });
}
