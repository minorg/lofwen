import { Identifier, Timestamp } from "@lofwen/models";
import { z } from "zod";

export type BaseEvent = z.infer<typeof BaseEvent.schema>;

export namespace BaseEvent {
  export const schema = z.object({
    "@id": Identifier.schema,
    timestamp: Timestamp.schema,
  });
}
