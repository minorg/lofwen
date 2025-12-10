import { z } from "zod";

export type Identifier = z.infer<typeof Identifier.schema>;

export namespace Identifier {
  export const schema = z.string();
}
