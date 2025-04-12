import type { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { Identifier } from "~/models/Identifier";

export type BaseAnswerEvent = z.infer<typeof BaseAnswerEvent.schema>;

export namespace BaseAnswerEvent {
  export const schema = BaseEvent.schema.extend({
    questionActionId: Identifier.schema,
  });
}
