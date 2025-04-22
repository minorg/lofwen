import type { Identifier } from "@lofwen/models";
import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";

export class PoseQuestionAction extends Action {
  readonly questionId: Identifier;

  constructor({ questionId }: { questionId: Identifier }) {
    super();
    this.questionId = questionId;
  }

  override async execute({
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    router.push(Hrefs.question({ "@id": this.questionId }));
  }

  override toString(): string {
    return `PoseQuestionAction(questionId=${this.questionId})`;
  }
}
