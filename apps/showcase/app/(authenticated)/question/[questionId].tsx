import {
  type LikertScaleAnswer,
  type TextAnswer,
  Timestamp,
} from "@lofwen/models";
import { LikertScaleQuestionView, TextQuestionView } from "@lofwen/ui";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { type ReactElement, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { executeAction } from "~/executeAction";
import { useEventLog } from "~/hooks/useEventLog";
import type { Answer } from "~/models/Answer";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("QuestionScreen");

export default function QuestionScreen() {
  logger.debug("rendering");

  const { questionId } = useLocalSearchParams<{
    questionId: string;
  }>();
  const eventLog = useEventLog();
  const nextAction = useMemo(() => workflow({ eventLog }), [eventLog]);
  const question = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "QuestionFormulatedEvent" &&
        event.question["@id"] === questionId
      ) {
        return event.question;
      }
    }
    return null;
  }, [eventLog, questionId]);
  const answer = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "QuestionAnsweredEvent" &&
        event.answer.questionId === questionId
      ) {
        return event.answer;
      }
    }
    return null;
  }, [eventLog, questionId]);
  const navigation = useNavigation();

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

    if (question !== null) {
      // Append a QuestionPosedEvent to the event log if it's not there already
      const lastEvent = eventLog.last;
      if (
        lastEvent === null ||
        lastEvent["@type"] !== "QuestionPosedEvent" ||
        lastEvent.questionId !== question["@id"]
      ) {
        eventLog.append({
          "@type": "QuestionPosedEvent",
          questionId: question["@id"],
          timestamp: Timestamp.now(),
        });
      }
    }
  }, [eventLog, navigation, question]);

  if (question === null) {
    logger.warn("no such question:", questionId);
    return <Redirect href={Hrefs.root} />;
  }

  if (
    nextAction["@type"] !== "PoseQuestionAction" ||
    nextAction.question["@id"] !== question["@id"]
  ) {
    return executeAction({ action: nextAction, eventLog });
  }
  logger.debug("next action would execute to the current page, nop");

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
