import {
  type DichotomousAnswer,
  type LikertScaleAnswer,
  type TextAnswer,
  Timestamp,
} from "@lofwen/models";
import {
  Redirect,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { DichotomousQuestionView } from "~/components/DichotomousQuestionView";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";
import { TextQuestionView } from "~/components/TextQuestionView";
import { useEventLog } from "~/hooks/useEventLog";
import { useNextAction } from "~/hooks/useNextAction";
import type { Answer } from "~/models/Answer";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("QuestionScreen");

export default function QuestionScreen() {
  const { questionId } = useLocalSearchParams<{
    questionId: string;
  }>();
  logger.debug(`rendering: questionId=${questionId}`);
  const eventLog = useEventLog();

  const answer = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "AnsweredQuestionEvent" &&
        event.questionId === questionId
      ) {
        logger.debug(`have answer to question ${questionId} in event log`);
        return event.answer;
      }
    }
    logger.debug(`no answer to question ${questionId} in event log`);
    return null;
  }, [eventLog, questionId]);

  const navigation = useNavigation();

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
        questionId,
        timestamp: Timestamp.now(),
        "@type": "AnsweredQuestionEvent",
      });
    },
    [eventLog, questionId],
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

  useFocusEffect(useNextAction());

  if (question === null) {
    logger.warn(`no such question: ${questionId}`);
    return <Redirect href={Hrefs.root} />;
  }

  switch (question["@type"]) {
    case "DichotomousQuestion": {
      invariant(answer === null || answer["@type"] === "DichotomousAnswer");
      return (
        <DichotomousQuestionView
          answer={answer as DichotomousAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
    }
    case "LikertScaleQuestion": {
      invariant(answer === null || answer["@type"] === "LikertScaleAnswer");
      return (
        <LikertScaleQuestionView
          answer={answer as LikertScaleAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
    }
    case "TextQuestion": {
      invariant(answer === null || answer["@type"] === "TextAnswer");
      return (
        <TextQuestionView
          answer={answer as TextAnswer | null}
          onAnswer={onAnswer}
          question={question}
        />
      );
    }
  }
}
