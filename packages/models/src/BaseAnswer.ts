import { z } from "zod";
import { Identifier } from "~/Identifier";

export type BaseAnswer = z.infer<typeof BaseAnswer.schema>;

export namespace BaseAnswer {
  export const schema = z.object({
    questionId: Identifier.schema,
  });
}
