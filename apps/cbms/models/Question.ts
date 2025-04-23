import {
  DichotomousQuestion,
  LikertScaleQuestion,
  TextQuestion,
} from "@lofwen/models";
import { z } from "zod";

export type Question = z.infer<typeof Question.schema>;

export namespace Question {
  export const typeSchemas = [
    DichotomousQuestion.schema,
    LikertScaleQuestion.schema,
    TextQuestion.schema,
  ] as const;

  export const schema = z.discriminatedUnion("@type", typeSchemas);
}
