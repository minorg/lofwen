import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompleteOnboardingAction } from "~/models/CompleteOnboardingAction";
import type { EventLog } from "~/models/EventLog";
import { FormulateInstructionsAction } from "~/models/FormulateInstructionsAction";
import { FormulateQuestionAction } from "~/models/FormulateQuestionAction";
import { GiveInstructionsAction } from "~/models/GiveInstructionsAction";
import type { Instructions } from "~/models/Instructions";
import { NopAction } from "~/models/NopAction";
import { PerceivedStressScale } from "~/models/PerceivedStressScale";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import type { Question } from "~/models/Question";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("workflow");

const onboardingSequence: readonly (Instructions | Question)[] = [
  {
    "@id": "initial-instructions",
    "@type": "Instructions",
    title: "Initial instructions",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  ...PerceivedStressScale.questions,
];

function formulateInstructionsOrQuestion(
  instructionsOrQuestion: Instructions | Question,
): Action {
  if (instructionsOrQuestion["@type"] === "Instructions") {
    return new FormulateInstructionsAction({
      instructions: instructionsOrQuestion,
    });
  }
  return new FormulateQuestionAction({
    question: instructionsOrQuestion,
  });
}

export const workflow = ({ eventLog }: { eventLog: EventLog }): Action => {
  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    return NopAction.instance;
  }

  switch (lastEvent["@type"]) {
    case "AcknowledgedInstructionsEvent":
    case "AnsweredQuestionEvent": {
      let onboardingSequenceIndex: number;
      if (lastEvent["@type"] === "AcknowledgedInstructionsEvent") {
        onboardingSequenceIndex = onboardingSequence.findIndex(
          (instructions) =>
            instructions["@type"] === "Instructions" &&
            instructions["@id"] === lastEvent.instructionsId,
        );
      } else {
        onboardingSequenceIndex = onboardingSequence.findIndex(
          (question) =>
            question["@type"] !== "Instructions" &&
            question["@id"] === lastEvent.questionId,
        );
      }
      invariant(
        onboardingSequenceIndex >= 0 &&
          onboardingSequenceIndex < onboardingSequence.length,
      );
      logger.debug(
        `answered/acknowledged onboarding sequence index (0-based): ${onboardingSequenceIndex}`,
      );
      if (onboardingSequenceIndex + 1 < onboardingSequence.length) {
        return formulateInstructionsOrQuestion(
          onboardingSequence[onboardingSequenceIndex + 1],
        );
      }

      // End of onboarding sequence
      return new CompleteOnboardingAction({
        perceivedStressScaleScores: PerceivedStressScale.score(
          PerceivedStressScale.questions.map((question) => {
            const answer = (
              eventLog.find(
                (event) =>
                  event["@type"] === "AnsweredQuestionEvent" &&
                  event.questionId === question["@id"],
              ) as AnsweredQuestionEvent | null
            )?.answer;
            invariant(answer, `no answer for question ${question["@id"]}`);
            invariant(answer["@type"] === "LikertScaleAnswer");
            return answer;
          }),
        ),
      });
    }

    case "CompletedOnboardingEvent":
      throw new Error("redirect to plot");

    case "FormulatedInstructionsEvent":
      return new GiveInstructionsAction({
        instructionsId: lastEvent.instructions["@id"],
      });

    case "FormulatedQuestionEvent":
      return new PoseQuestionAction({
        questionId: lastEvent.question["@id"],
      });

    case "GaveInstructionsEvent":
      return NopAction.instance; // Wait for acknowledgment

    case "PosedQuestionEvent":
      return NopAction.instance; // Wait for the answer

    case "StartedAppEvent":
      if (
        eventLog.some((event) => event["@type"] === "CompletedOnboardingEvent")
      ) {
        throw new Error("redirect to plot");
      }

      // Start onboarding
      return formulateInstructionsOrQuestion(onboardingSequence[0]);
  }
};
