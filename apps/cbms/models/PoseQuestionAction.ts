import type { Identifier } from "@lofwen/models";
import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("PoseQuestionAction");

/**
 * Redirect to the question page.
 *
 * Assumes the Question referenced by questionId have already been added to the event log as a FormulatedQuestionEvent by FormulateQuestionAction.
 *
 * See notes in FormulateQuestionAction re: the action-event sequence.
 */
export class PoseQuestionAction extends Action {
  readonly questionId: Identifier;

  constructor({ questionId }: { questionId: Identifier }) {
    super();
    this.questionId = questionId;
  }

  override async execute({
    route,
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    if (route.pathname !== `/question/${this.questionId}`) {
      logger.debug(
        `current route isn't to the question ${this.questionId}, pushing`,
      );
      router.push(Hrefs.question({ "@id": this.questionId }));
    } else {
      logger.debug(
        `current route is already to the question ${this.questionId}, nop`,
      );
    }
  }

  override toString(): string {
    return `PoseQuestionAction(questionId=${this.questionId})`;
  }
}
