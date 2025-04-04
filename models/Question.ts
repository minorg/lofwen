import { z } from "zod";
import { LikertScaleQuestion } from "~/models/LikertScaleQuestion";

export type Question = z.infer<typeof Question.schema>;

export namespace Question {
  export const schema = z.discriminatedUnion("questionType", [
    LikertScaleQuestion.schema,
  ]);
}
