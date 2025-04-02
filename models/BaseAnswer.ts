import { z } from "zod";
import { Identifier } from "~/models/Identifier";

export type BaseAnswer = z.infer<typeof BaseAnswer.schema>;

export namespace BaseAnswer {
  export const schema = z.object({
    identifier: Identifier.schema,
    questionIdentifier: Identifier.schema,
  });
}
