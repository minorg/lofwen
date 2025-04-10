import { z } from "zod";
import { Timestamp } from "~/models/Timestamp";

export type BaseLogEntry = z.infer<typeof BaseLogEntry.schema>;

export namespace BaseLogEntry {
  export const schema = z.object({
    timestamp: Timestamp.schema,
  });
}
