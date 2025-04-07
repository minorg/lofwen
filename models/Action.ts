import { z } from "zod";
import { AcknowledgmentAction } from "~/models/AcknowledgmentAction";
import { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";

export type Action = z.infer<typeof Action.schema>;

export namespace Action {
  export const schema = z.discriminatedUnion("@type", [
    AcknowledgmentAction.schema,
    LikertScaleQuestionAction.schema,
  ]);
}
