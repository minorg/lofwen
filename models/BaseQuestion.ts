import { z } from "zod";

export type BaseQuestion = z.infer<typeof BaseQuestion.schema>;

export namespace BaseQuestion {
  export const schema = z.object({});
}
