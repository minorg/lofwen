import { z } from "zod";

export type BaseAnswer = z.infer<typeof BaseAnswer.schema>;

export namespace BaseAnswer {
  export const schema = z.object({});
}
