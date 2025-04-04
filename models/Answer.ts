import { z } from "zod";
import { LikertScaleAnswer } from "~/models/LikertScaleAnswer";

export type Answer = z.infer<typeof Answer.schema>;

export namespace Answer {
  export const schema = z.discriminatedUnion("answerType", [
    LikertScaleAnswer.schema,
  ]);
}
