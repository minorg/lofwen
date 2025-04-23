import { Timestamp } from "@lofwen/models";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import type { Question } from "~/models/Question";

export class FormulateQuestionAction extends ExecutableAction {
  readonly question: Question;

  constructor({ question }: { question: Question }) {
    super();
    this.question = question;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "FormulatedQuestionEvent",
      question: this.question,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `FormulateQuestionAction(question=${this.question["@type"]}(@id=${this.question["@id"]}))`;
  }
}
