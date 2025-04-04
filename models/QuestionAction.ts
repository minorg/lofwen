import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";
import { Question } from "~/models/Question";

export type QuestionAction = z.infer<typeof QuestionAction.schema>;

export namespace QuestionAction {
  export const schema = BaseAction.schema.extend({
    actionType: z.literal("QuestionAction"),
    question: Question.schema,
  });
}
