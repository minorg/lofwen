import { z } from "zod";
import { BaseAnswerEvent } from "~/models/BaseAnswerEvent";

export type TextAnswerEvent = z.infer<typeof TextAnswerEvent.schema>;

export namespace TextAnswerEvent {
  export const schema = BaseAnswerEvent.schema.extend({
    "@type": z.literal("TextAnswerEvent"),
    text: z.string(),
  });
}
