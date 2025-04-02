import { z } from "zod";
import { AnswerEvent } from "~/models/AnswerEvent";
import { InitialEvent } from "~/models/InitialEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("type", [
    AnswerEvent.schema,
    InitialEvent.schema,
  ]);
}
