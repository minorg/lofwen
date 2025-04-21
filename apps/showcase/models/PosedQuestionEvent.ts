import { Identifier } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type PosedQuestionEvent = z.infer<typeof PosedQuestionEvent.schema>;

export namespace PosedQuestionEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("PosedQuestionEvent"),
    questionId: Identifier.schema,
  });
}
