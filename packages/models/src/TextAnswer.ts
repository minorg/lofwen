import { z } from "zod";

export type TextAnswer = z.infer<typeof TextAnswer.schema>;

export namespace TextAnswer {
  export const schema = z.object({
    "@type": z.literal("TextAnswer"),
    text: z.string(),
  });
}
