import { z } from "zod";
import { Identifier } from "~/models/Identifier";
import { Timestamp } from "~/models/Timestamp";

export type BaseEvent = z.infer<typeof BaseEvent.schema>;

export namespace BaseEvent {
  export const schema = z.object({
    identifier: Identifier.schema,
    timestamp: Timestamp.schema,
  });
}
