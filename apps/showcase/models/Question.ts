import { LikertScaleQuestion, TextQuestion } from "@lofwen/models";
import { z } from "zod";

export type Question = z.infer<typeof Question.schema>;

export namespace Question {
  export const schema = z.discriminatedUnion("@type", [
    LikertScaleQuestion.schema,
    TextQuestion.schema,
  ]);
}
