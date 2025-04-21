import invariant from "ts-invariant";
import type { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompleteOnboardingAction } from "~/models/CompleteOnboardingAction";
import type { EventLog } from "~/models/EventLog";
import { GiveInstructionsAction } from "~/models/GiveInstructionsAction";
import { PerceivedStressScale } from "~/models/PerceivedStressScale";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import { WelcomeAction } from "~/models/WelcomeAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("workflow");

const onboardingQuestions = PerceivedStressScale.questions;

export const workflow = ({ eventLog }: { eventLog: EventLog }) => {
  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    return WelcomeAction.instance;
  }

  switch (lastEvent["@type"]) {
    case "AnsweredQuestionEvent": {
      const answer = lastEvent.answer;

      const questionIndexZeroBased = onboardingQuestions.findIndex(
        (questionAction) => questionAction["@id"] === answer.questionId,
      );
      invariant(
        questionIndexZeroBased >= 0 &&
          questionIndexZeroBased < onboardingQuestions.length,
      );
      logger.debug(
        "answered onboarding question index (0-based):",
        questionIndexZeroBased,
      );
      if (questionIndexZeroBased + 1 < onboardingQuestions.length) {
        // Questions remaining
        return onboardingQuestions[questionIndexZeroBased + 1];
      }

      // Last question answered
      return new CompleteOnboardingAction({
        perceivedStressScaleScores: PerceivedStressScale.score(
          PerceivedStressScale.questions.map((question) => {
            const answer = (
              eventLog.find(
                (event) =>
                  event["@type"] === "AnsweredQuestionEvent" &&
                  event.answer.questionId === question["@id"],
              ) as AnsweredQuestionEvent | null
            )?.answer;
            invariant(answer, `no answer for question ${question["@id"]}`);
            invariant(answer["@type"] === "LikertScaleAnswer");
            return answer;
          }),
        ),
      });

      // return {
      //   "@id": "pss-acknowledgment",
      //   "@type": "AcknowledgmentAction",
      //   message: `Your perceived stress: ${perceivedStress} (total score: ${totalScore})`,
      //   title: "Perceived Stress Scale",
      // } satisfies AcknowledgmentAction;
    }

    case "GaveInstructionsEvent": {
      // Return the GiveInstructionsAction again so the workflow is deterministic
      return new GiveInstructionsAction({
        instructions: lastEvent.instructions,
      });
    }

    case "PosedQuestionEvent": {
      // Return the PoseQuestionAction again so the workflow is deterministic
      return new PoseQuestionAction({ question: lastEvent.question });
    }

    case "StartedAppEvent": {
      if (
        eventLog.some((event) => event["@type"] === "CompletedOnboardingEvent")
      ) {
        throw new Error("redirect to plot");
      }

      // Start onboarding
      return new PoseQuestionAction({ question: onboardingQuestions[0] });
    }
  }
};
