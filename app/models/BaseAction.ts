import { z } from "zod";
import { Identifier } from "~/models/Identifier";

export type BaseAction = z.infer<typeof BaseAction.schema>;

export namespace BaseAction {
  export const schema = z.object({
    "@id": Identifier.schema,
  });
}
