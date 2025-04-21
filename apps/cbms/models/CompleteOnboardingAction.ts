import { Timestamp } from "@lofwen/models";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import type { PerceivedStressScale } from "~/models/PerceivedStressScale";

export class CompleteOnboardingAction extends ExecutableAction {
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
