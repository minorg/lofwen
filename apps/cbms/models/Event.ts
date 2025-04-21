import { z } from "zod";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompletedOnboardingEvent } from "~/models/CompletedOnboardingEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";
import { StartedAppEvent } from "~/models/StartedAppEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AnsweredQuestionEvent.schema,
    CompletedOnboardingEvent.schema,
    PosedQuestionEvent.schema,
    StartedAppEvent.schema,
  ]);
}
