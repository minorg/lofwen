import { z } from "zod";
import { BaseRenderableAction } from "~/models/BaseRenderableAction";

export type BaseQuestionAction = z.infer<typeof BaseQuestionAction.schema>;

export namespace BaseQuestionAction {
  export const schema = BaseRenderableAction.schema.extend({
    prompt: z.string(),
  });
}
