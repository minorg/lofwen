import { z } from "zod";
import { BaseQuestion } from "~/models/BaseQuestion";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleQuestion = z.infer<typeof LikertScaleQuestion.schema>;

export namespace LikertScaleQuestion {
  export const schema = BaseQuestion.schema.extend({
    responseCategories: z.array(OrdinalCategory.schema),
    type: z.literal("LikertScaleQuestion"),
  });
}
