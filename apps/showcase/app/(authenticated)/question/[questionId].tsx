import {
  type DichotomousAnswer,
  type LikertScaleAnswer,
  type TextAnswer,
  Timestamp,
} from "@lofwen/models";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { type ReactElement, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { DichotomousQuestionView } from "~/components/DichotomousQuestionView";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";
import { TextQuestionView } from "~/components/TextQuestionView";
import { useAuthenticatedUser } from "~/hooks/useAuthenticatedUser";
import { useEventLog } from "~/hooks/useEventLog";
import type { Answer } from "~/models/Answer";
import { ExecutableAction } from "~/models/ExecutableAction";
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
  const user = useAuthenticatedUser();

  const answer = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "AnsweredQuestionEvent" &&
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

  const nextAction = useMemo(
    () => workflow({ eventLog, user }),
    [eventLog, user],
  );
  logger.debug(`next action: ${nextAction}`);

  const question = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "FormulatedQuestionEvent" &&
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
        "@type": "AnsweredQuestionEvent",
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run useEffect once
  useEffect(() => {
    if (question !== null) {
      eventLog.append({
        "@type": "PosedQuestionEvent",
        questionId: question["@id"],
        timestamp: Timestamp.now(),
      });
    }
  }, []);

  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);

  if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  }
  invariant(nextAction instanceof ExecutableAction);

  if (question === null) {
    logger.warn(`no such question: ${questionId}`);
    return <Redirect href={Hrefs.root} />;
  }

  let questionView: ReactElement;
  switch (question["@type"]) {
    case "DichotomousQuestion": {
      invariant(answer === null || answer["@type"] === "DichotomousAnswer");
      questionView = (
        <DichotomousQuestionView
          answer={answer as DichotomousAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
      break;
    }
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
