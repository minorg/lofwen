import { z } from "zod";
import { Identifier } from "./Identifier";

export type BaseQuestion = z.infer<typeof BaseQuestion.schema>;

export namespace BaseQuestion {
  export const schema = z.object({
    "@id": Identifier.schema,
    prompt: z.string(),
  });
}
