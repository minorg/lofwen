import { useCallback, useMemo } from "react";
import { QuestionView } from "~/components/QuestionView";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";
import {
  type Answer,
  Identifier,
  type QuestionAction,
  Timestamp,
} from "~/models";

export function QuestionActionView({
  questionAction,
}: { questionAction: QuestionAction }) {
  const addLogEntry = useAddLogEntry();
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
      addLogEntry({
        answer,
        eventType: "AnswerEvent",
        identifier: Identifier.random(),
        logEntryType: "Event",
        questionActionIdentifier: questionAction.identifier,
        timestamp: Timestamp.now(),
      });
    },
    [addLogEntry, questionAction],
  );

  return (
    <QuestionView
      answer={existingAnswer}
      onAnswer={onAnswer}
      question={questionAction.question}
    />
  );
}
