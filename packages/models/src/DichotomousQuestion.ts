import { z } from "zod";
import { BaseQuestion } from "./BaseQuestion";
import { OrdinalCategory } from "./OrdinalCategory";

export type DichotomousQuestion = z.infer<typeof DichotomousQuestion.schema>;

export namespace DichotomousQuestion {
  export const schema = BaseQuestion.schema.extend({
    responseCategories: z.array(OrdinalCategory.schema).length(2),
    "@type": z.literal("DichotomousQuestion"),
  });
}
