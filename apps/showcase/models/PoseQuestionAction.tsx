import type { Identifier } from "@lofwen/models";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Hrefs } from "~/Hrefs";
import { RenderableAction } from "~/models/RenderableAction";

export class PoseQuestionAction extends RenderableAction {
  readonly questionId: Identifier;

  constructor({ questionId }: { questionId: Identifier }) {
    super();
    this.questionId = questionId;
  }

  override render(): ReactNode {
    return <Redirect href={Hrefs.question({ "@id": this.questionId })} />;
  }

  override toString(): string {
    return `PoseQuestionAction(questionId=${this.questionId}))`;
  }
}
