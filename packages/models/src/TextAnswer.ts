import { z } from "zod";
import { BaseAnswer } from "./BaseAnswer";

export type TextAnswer = z.infer<typeof TextAnswer.schema>;

export namespace TextAnswer {
  export const schema = BaseAnswer.schema.extend({
    "@type": z.literal("TextAnswer"),
    text: z.string(),
  });
}
