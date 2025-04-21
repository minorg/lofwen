import { z } from "zod";
import { AcknowledgedInstructionsEvent } from "~/models/AcknowledgedInstructionsEvent";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompletedOnboardingEvent } from "~/models/CompletedOnboardingEvent";
import { GaveInstructionsEvent } from "~/models/GaveInstructionsEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";
import { StartedAppEvent } from "~/models/StartedAppEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AcknowledgedInstructionsEvent.schema,
    AnsweredQuestionEvent.schema,
    CompletedOnboardingEvent.schema,
    GaveInstructionsEvent.schema,
    PosedQuestionEvent.schema,
    StartedAppEvent.schema,
  ]);
}
