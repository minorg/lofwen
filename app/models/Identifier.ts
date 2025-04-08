import { randomUUID } from "expo-crypto";
import { z } from "zod";

export type Identifier = z.infer<typeof Identifier.schema>;

export namespace Identifier {
  export function random(): Identifier {
    return randomUUID();
  }

  export const schema = z.string();
}
