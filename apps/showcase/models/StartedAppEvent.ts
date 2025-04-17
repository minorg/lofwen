import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Question } from "~/models/Question";

export type StartedAppEvent = z.infer<typeof StartedAppEvent.schema>;

export namespace StartedAppEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("StartedAppEvent"),
    question: Question.schema,
  });
}
