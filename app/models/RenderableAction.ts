import { z } from "zod";
import { AcknowledgmentAction } from "~/models/AcknowledgmentAction";
import { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";
import { TextQuestionAction } from "~/models/TextQuestionAction";

export type RenderableAction = z.infer<typeof RenderableAction.schema>;

export namespace RenderableAction {
  export const schema = z.discriminatedUnion("@type", [
    AcknowledgmentAction.schema,
    LikertScaleQuestionAction.schema,
    TextQuestionAction.schema,
  ]);
}
