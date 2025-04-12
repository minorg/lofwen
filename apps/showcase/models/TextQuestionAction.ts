import { z } from "zod";
import { BaseQuestionAction } from "~/models/BaseQuestionAction";

export type TextQuestionAction = z.infer<typeof TextQuestionAction.schema>;

export namespace TextQuestionAction {
  export const schema = BaseQuestionAction.schema.extend({
    "@type": z.literal("TextQuestionAction"),
  });
}
