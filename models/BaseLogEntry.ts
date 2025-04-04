import { z } from "zod";
import { Identifier } from "~/models/Identifier";
import { Timestamp } from "~/models/Timestamp";

export type BaseLogEntry = z.infer<typeof BaseLogEntry.schema>;

export namespace BaseLogEntry {
  export const schema = z.object({
    identifier: Identifier.schema,
    timestamp: Timestamp.schema,
  });
}
