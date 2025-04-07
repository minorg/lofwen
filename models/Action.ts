import { z } from "zod";
import { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";

export type Action = z.infer<typeof Action.schema>;

export namespace Action {
  export const schema = z.discriminatedUnion("actionType", [
    LikertScaleQuestionAction.schema,
  ]);
}
