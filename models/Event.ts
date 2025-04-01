import { z } from "zod";
import { AnswerEvent } from "~/models/AnswerEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("type", [AnswerEvent.schema]);
}
