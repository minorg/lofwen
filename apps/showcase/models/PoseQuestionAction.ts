import type { Question } from "~/models/Question";

export interface PoseQuestionAction {
  readonly question: Question;
  readonly "@type": "PoseQuestionAction";
}
