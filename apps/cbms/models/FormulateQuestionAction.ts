import { Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import type { Question } from "~/models/Question";

/**
 * Action to add a FormulatedQuestionEvent to the event log.
 *
 * The action-event sequence is as follows:
 * 1. FormulateQuestionAction: add an Question to the event log for subsequent use by #2 and #3.
 * 2. FormulatedQuestionEvent
 * 3. PoseQuestionAction: redirect to the instructions page. The redirect URL can't contain the full instructions, only the id,
 *   which is used by the page to locate the the FormulateQuestionAction with the actual Question.
 * 4. PosedQuestionEvent.
 * 5. AnsweredQuestionEvent.
 */
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
