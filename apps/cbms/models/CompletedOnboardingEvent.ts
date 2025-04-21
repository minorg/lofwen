import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type CompletedOnboardingEvent = z.infer<
  typeof CompletedOnboardingEvent.schema
>;

export namespace CompletedOnboardingEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("CompletedOnboardingEvent"),
  });
}
