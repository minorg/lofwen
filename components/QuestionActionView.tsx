import { useCallback, useMemo } from "react";
import { QuestionView } from "~/components/QuestionView";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";
import {
  type Answer,
  type Event,
  Identifier,
  type QuestionAction,
  Timestamp,
} from "~/models";

export function QuestionActionView({
  onEvent,
  questionAction,
}: {
  onEvent: (event: Event) => void;
  questionAction: QuestionAction;
}) {
  const log = useLog();
  const existingAnswer = useMemo(() => {
    const existingAnswer =
      log.answerEventByQuestionActionIdentifier(questionAction.identifier)
        ?.answer ?? null;
    logger.debug("existing answer:", JSON.stringify(existingAnswer));
    return existingAnswer;
  }, [log, questionAction]);

  const onAnswer = useCallback(
    (answer: Answer) => {
      logger.debug("on answer:", JSON.stringify(answer));
      onEvent({
        answer,
        eventType: "AnswerEvent",
        identifier: Identifier.random(),
        logEntryType: "Event",
        questionActionIdentifier: questionAction.identifier,
        timestamp: Timestamp.now(),
      });
    },
    [onEvent, questionAction],
  );

  return (
    <QuestionView
      answer={existingAnswer}
      onAnswer={onAnswer}
      question={questionAction.question}
    />
  );
}
