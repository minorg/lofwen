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
import { useEventLog } from "~/hooks/useEventLog";
import { useWorkflowEngine } from "~/hooks/useWorkflowEngine";
import type { Answer } from "~/models/Answer";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("QuestionScreen");

export default function QuestionScreen() {
  const { questionId } = useLocalSearchParams<{
    questionId: string;
  }>();
  const eventLog = useEventLog();
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
  const workflowEngine = useWorkflowEngine();

  const onAnswer = useCallback(
    (answer: Answer) => {
      workflowEngine.onEvent({
        answer,
        timestamp: Timestamp.now(),
        "@type": "QuestionAnsweredEvent",
      });
    },
    [workflowEngine],
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
