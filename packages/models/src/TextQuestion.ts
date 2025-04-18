import { z } from "zod";
import { BaseQuestion } from "./BaseQuestion";

export type TextQuestion = z.infer<typeof TextQuestion.schema>;

export namespace TextQuestion {
  export const schema = BaseQuestion.schema.extend({
    "@type": z.literal("TextQuestion"),
  });
}
