import { z } from "zod";
import { BaseQuestion } from "~/models/BaseQuestion";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleQuestion = z.infer<typeof LikertScaleQuestion.schema>;

export namespace LikertScaleQuestion {
  export const schema = BaseQuestion.schema.extend({
    item: z.string(),
    questionType: z.literal("LikertScaleQuestion"),
    responseCategories: z.array(OrdinalCategory.schema),
  });
}
