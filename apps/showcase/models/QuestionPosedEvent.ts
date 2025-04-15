import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type QuestionPosedEvent = z.infer<typeof QuestionPosedEvent.schema>;

export namespace QuestionPosedEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("QuestionPosedEvent"),
    questionId: Identifier.schema,
  });
}
