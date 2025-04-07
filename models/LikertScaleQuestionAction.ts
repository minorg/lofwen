import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleQuestionAction = z.infer<
  typeof LikertScaleQuestionAction.schema
>;

export namespace LikertScaleQuestionAction {
  export const schema = BaseAction.schema.extend({
    item: z.string(),
    responseCategories: z.array(OrdinalCategory.schema),
    "@type": z.literal("LikertScaleQuestionAction"),
  });
}
