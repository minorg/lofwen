import { z } from "zod";
import { InitialEvent } from "~/models/InitialEvent";
import { LikertScaleAnswerEvent } from "~/models/LikertScaleAnswerEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("eventType", [
    InitialEvent.schema,
    LikertScaleAnswerEvent.schema,
  ]);
}
