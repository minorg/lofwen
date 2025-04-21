import { Timestamp } from "@lofwen/models";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";

export class CompleteOnboardingAction extends ExecutableAction {
  static readonly instance = new CompleteOnboardingAction();

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "CompletedOnboardingEvent",
      timestamp: Timestamp.now(),
    });
  }

  private constructor() {
    super();
  }

  override toString(): string {
    return "CompleteOnboardingAction()";
  }
}
