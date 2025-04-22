import { Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import type { PerceivedStressScale } from "~/models/PerceivedStressScale";

export class CompleteOnboardingAction extends Action {
  private readonly perceivedStressScaleScores: PerceivedStressScale.Scores;

  constructor({
    perceivedStressScaleScores,
  }: { perceivedStressScaleScores: PerceivedStressScale.Scores }) {
    super();
    this.perceivedStressScaleScores = perceivedStressScaleScores;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "CompletedOnboardingEvent",
      perceivedStressScaleScores: this.perceivedStressScaleScores,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return "CompleteOnboardingAction()";
  }
}
