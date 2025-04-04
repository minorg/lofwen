import { invariant } from "ts-invariant";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";
import type { Answer, LikertScaleAnswer, Question } from "~/models";

export function QuestionView({
  answer,
  onAnswer,
  question,
}: {
  answer: Answer | null;
  onAnswer: (answer: Answer) => void;
  question: Question;
}) {
  switch (question.questionType) {
    case "LikertScaleQuestion":
      if (answer !== null) {
        invariant(answer.answerType === "LikertScaleAnswer");
      }
      return (
        <LikertScaleQuestionView
          answer={answer as LikertScaleAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
  }
}
