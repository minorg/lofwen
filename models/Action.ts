import { z } from "zod";
import { QuestionAction } from "~/models/QuestionAction";

export type Action = z.infer<typeof Action.schema>;

export namespace Action {
  export const schema = z.discriminatedUnion("actionType", [
    QuestionAction.schema,
  ]);
}
