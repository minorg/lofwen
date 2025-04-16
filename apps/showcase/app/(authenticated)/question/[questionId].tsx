import {
  type LikertScaleAnswer,
  type TextAnswer,
  Timestamp,
} from "@lofwen/models";
import { LikertScaleQuestionView, TextQuestionView } from "@lofwen/ui";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { type ReactElement, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import invariant from "ts-invariant";
import { useEventLog } from "~/hooks/useEventLog";
import type { Answer } from "~/models/Answer";
import { ExecutableAction } from "~/models/ExecutableAction";
import { NopAction } from "~/models/NopAction";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("QuestionScreen");

export default function QuestionScreen() {
  logger.debug("rendering");

  const { questionId } = useLocalSearchParams<{
    questionId: string;
  }>();
  const eventLog = useEventLog();

  const answer = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "QuestionAnsweredEvent" &&
        event.answer.questionId === questionId
      ) {
        logger.debug(`have answer to question ${questionId} in event log`);
        return event.answer;
      }
    }
    logger.debug(`no answer to question ${questionId} in event log`);
    return null;
  }, [eventLog, questionId]);

  const navigation = useNavigation();

  const nextAction = useMemo(() => workflow({ eventLog }), [eventLog]);

  const question = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "QuestionPosedEvent" &&
        event.question["@id"] === questionId
      ) {
        logger.debug(`have question ${questionId} in event log`);
        return event.question;
      }
    }
    logger.debug(`no question ${questionId} in event log`);
    return null;
  }, [eventLog, questionId]);

  const onAnswer = useCallback(
    (answer: Answer) => {
      eventLog.append({
        answer,
        timestamp: Timestamp.now(),
        "@type": "QuestionAnsweredEvent",
      });
    },
    [eventLog],
  );

  useEffect(() => {
    if (question?.title) {
      navigation.setOptions({
        headerTitle: question.title,
      });
    }
  }, [navigation, question]);

  useEffect(() => {
    const lastEvent = eventLog.last;
    // The workflow should return the PoseQuestionAction until the redirect here succeeds and the QuestionPosedEvent is added to the event log
    if (
      nextAction instanceof PoseQuestionAction &&
      nextAction.question["@id"] === questionId
    ) {
      if (
        lastEvent === null ||
        lastEvent["@type"] !== "QuestionPosedEvent" ||
        lastEvent.question["@id"] !== questionId
      ) {
        logger.debug(
          `last event is not a QuestionPosedEvent to the current question (${questionId}), appending a QuestionPosedEvent to the event log`,
        );
        eventLog.append({
          "@type": "QuestionPosedEvent",
          question: nextAction.question,
          timestamp: Timestamp.now(),
        });
      } else {
        logger.debug(
          `last event is already a QuestionPosedEvent to the current question (${questionId})`,
        );
      }
    }
  }, [eventLog, nextAction, questionId]);

  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);

  if (nextAction instanceof NopAction) {
    logger.debug("next action is nop");
  } else if (nextAction instanceof PoseQuestionAction) {
    if (nextAction.question["@id"] === questionId) {
      logger.debug("next action would execute to the current page, nop");
    } else {
      return nextAction.render();
    }
  } else if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  } else {
    invariant(nextAction instanceof ExecutableAction);
  }

  if (question === null) {
    logger.debug("question not set yet");
    return null;
  }

  let questionView: ReactElement;
  switch (question["@type"]) {
    case "LikertScaleQuestion": {
      invariant(answer === null || answer["@type"] === "LikertScaleAnswer");
      questionView = (
        <LikertScaleQuestionView
          answer={answer as LikertScaleAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
      break;
    }
    case "TextQuestion": {
      invariant(answer === null || answer["@type"] === "TextAnswer");
      questionView = (
        <TextQuestionView
          answer={answer as TextAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
    }
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="web:px-4">{questionView}</View>
    </SafeAreaView>
  );
}
