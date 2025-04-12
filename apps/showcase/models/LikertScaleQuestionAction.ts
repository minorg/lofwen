import { z } from "zod";
import { BaseQuestionAction } from "~/models/BaseQuestionAction";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleQuestionAction = z.infer<
  typeof LikertScaleQuestionAction.schema
>;

export namespace LikertScaleQuestionAction {
  export const schema = BaseQuestionAction.schema.extend({
    responseCategories: z.array(OrdinalCategory.schema),
    "@type": z.literal("LikertScaleQuestionAction"),
  });
}
