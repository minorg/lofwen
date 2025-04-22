import { z } from "zod";
import { AcknowledgedInstructionsEvent } from "~/models/AcknowledgedInstructionsEvent";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompletedOnboardingEvent } from "~/models/CompletedOnboardingEvent";
import { FormulatedGardenEvent } from "~/models/FormulatedGardenEvent";
import { FormulatedInstructionsEvent } from "~/models/FormulatedInstructionsEvent";
import { FormulatedQuestionEvent } from "~/models/FormulatedQuestionEvent";
import { GaveInstructionsEvent } from "~/models/GaveInstructionsEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AcknowledgedInstructionsEvent.schema,
    AnsweredQuestionEvent.schema,
    CompletedOnboardingEvent.schema,
    FormulatedGardenEvent.schema,
    FormulatedInstructionsEvent.schema,
    FormulatedQuestionEvent.schema,
    GaveInstructionsEvent.schema,
    PosedQuestionEvent.schema,
  ]);
}
