import { z } from "zod";
import { AcknowledgmentAction } from "~/models/AcknowledgmentAction";
import { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";
import type { RenderableAction } from "~/models/RenderableAction";
import { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";
import { TextQuestionAction } from "~/models/TextQuestionAction";

export type Action = z.infer<typeof Action.schema>;

export namespace Action {
  export function isRenderable(action: Action): action is RenderableAction {
    switch (action["@type"]) {
      case "AcknowledgmentAction":
      case "LikertScaleQuestionAction":
      case "TextQuestionAction":
        return true;
      case "ScheduleNotificationAction":
        return false;
    }
  }

  export const schema = z.discriminatedUnion("@type", [
    AcknowledgmentAction.schema,
    LikertScaleQuestionAction.schema,
    ScheduleNotificationAction.schema,
    TextQuestionAction.schema,
  ]);
}
