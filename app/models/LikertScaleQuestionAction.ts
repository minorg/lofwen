import { z } from "zod";
import { BaseRenderableAction } from "~/models/BaseRenderableAction";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleQuestionAction = z.infer<
  typeof LikertScaleQuestionAction.schema
>;

export namespace LikertScaleQuestionAction {
  export const schema = BaseRenderableAction.schema.extend({
    item: z.string(),
    responseCategories: z.array(OrdinalCategory.schema),
    "@type": z.literal("LikertScaleQuestionAction"),
  });
}
