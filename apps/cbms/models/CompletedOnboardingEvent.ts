import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { PerceivedStressScale } from "~/models/PerceivedStressScale";

/**
 * The user completed onboarding (instructions and questions).
 */
export type CompletedOnboardingEvent = z.infer<
  typeof CompletedOnboardingEvent.schema
>;

export namespace CompletedOnboardingEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("CompletedOnboardingEvent"),
    perceivedStressScaleScores: PerceivedStressScale.Scores.schema,
  });
}
