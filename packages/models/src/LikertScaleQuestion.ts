import { z } from "zod";
import { BaseQuestion } from "~/BaseQuestion";
import { OrdinalCategory } from "~/OrdinalCategory";

export type LikertScaleQuestion = z.infer<typeof LikertScaleQuestion.schema>;

export namespace LikertScaleQuestion {
  export const schema = BaseQuestion.schema.extend({
    responseCategories: z.array(OrdinalCategory.schema),
    "@type": z.literal("LikertScaleQuestion"),
  });
}
