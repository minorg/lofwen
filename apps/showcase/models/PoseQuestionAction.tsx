import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Hrefs } from "~/Hrefs";
import type { Question } from "~/models/Question";
import { RenderableAction } from "~/models/RenderableAction";

export class PoseQuestionAction extends RenderableAction {
  constructor(readonly question: Question) {
    super();
  }

  override render(): ReactNode {
    return <Redirect href={Hrefs.question(this.question)} />;
  }

  override toString(): string {
    return `PoseQuestionAction(question=${this.question["@type"]}(@id=${this.question["@id"]}))`;
  }
}
