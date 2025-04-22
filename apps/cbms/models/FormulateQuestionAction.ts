import { Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import type { Question } from "~/models/Question";

export class FormulateQuestionAction extends Action {
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
