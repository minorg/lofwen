import {
  DichotomousAnswer,
  LikertScaleAnswer,
  TextAnswer,
} from "@lofwen/models";
import { z } from "zod";

export type Answer = z.infer<typeof Answer.schema>;

export namespace Answer {
  export const schema = z.discriminatedUnion("@type", [
    DichotomousAnswer.schema,
    LikertScaleAnswer.schema,
    TextAnswer.schema,
  ]);
}
