import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompleteOnboardingAction } from "~/models/CompleteOnboardingAction";
import type { EventLog } from "~/models/EventLog";
import { FormulateGardenAction } from "~/models/FormulateGardenAction";
import { FormulateInstructionsAction } from "~/models/FormulateInstructionsAction";
import { FormulateQuestionAction } from "~/models/FormulateQuestionAction";
import { GiveInstructionsAction } from "~/models/GiveInstructionsAction";
import type { Instructions } from "~/models/Instructions";
import { PerceivedStressScale } from "~/models/PerceivedStressScale";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import type { Question } from "~/models/Question";
import { ShowGardenAction } from "~/models/ShowGardenAction";
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

export const workflow = ({ eventLog }: { eventLog: EventLog }): Action => {
  const instructionsOrQuestionAction = (
    instructionsOrQuestion: Instructions | Question,
  ): Action => {
    if (instructionsOrQuestion["@type"] === "Instructions") {
      const instructions = instructionsOrQuestion;

      if (
        eventLog.some(
          (event) =>
            event["@type"] === "FormulatedInstructionsEvent" &&
            event.instructions["@id"] === instructions["@id"],
        )
      ) {
        logger.debug(
          `already formulated instructions ${instructions["@id"]}, giving instead`,
        );
        return new GiveInstructionsAction({
          instructionsId: instructions["@id"],
        });
      }
      logger.debug(`formulating instructions ${instructions["@id"]}`);
      return new FormulateInstructionsAction({
        instructions: instructionsOrQuestion,
      });
    }

    const question: Question = instructionsOrQuestion;
    if (
      eventLog.some(
        (event) =>
          event["@type"] === "FormulatedQuestionEvent" &&
          event.question["@id"] === question["@id"],
      )
    ) {
      logger.debug(
        `already formulated question ${question["@id"]}, posing instead`,
      );
      return new PoseQuestionAction({ questionId: question["@id"] });
    }
    logger.debug(`formulating question ${question["@id"]}`);
    return new FormulateQuestionAction({
      question: instructionsOrQuestion,
    });
  };

  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    logger.debug("no last event, starting onboarding");
    return instructionsOrQuestionAction(onboardingSequence[0]);
  }
  logger.debug(`last event type: ${lastEvent["@type"]}`);

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
        return instructionsOrQuestionAction(
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
      return new FormulateGardenAction({
        garden: {
          items: [
            {
              "@id": "shovel",
              icon: {
                family: "MaterialCommunityIcons",
                name: "shovel",
              },
              text: "You need a shovel.",
              title: "Shovel",
            },
            {
              "@id": "trowel",
              icon: {
                family: "FontAwesome6",
                name: "trowel",
              },
              text: "You need a trowel.",
              title: "Trowel",
            },
            {
              "@id": "seed",
              icon: {
                family: "MaterialCommunityIcons",
                name: "seed",
              },
              text: "You need some seeds.",
              title: "Seeds",
            },
          ],
        },
      });

    case "FormulatedGardenEvent":
      return ShowGardenAction.instance;

    case "FormulatedInstructionsEvent":
      return new GiveInstructionsAction({
        instructionsId: lastEvent.instructions["@id"],
      });

    case "FormulatedQuestionEvent":
      return new PoseQuestionAction({
        questionId: lastEvent.question["@id"],
      });

    case "GaveInstructionsEvent":
      // May be resuming, redirect to the question page
      return new GiveInstructionsAction({
        instructionsId: lastEvent.instructionsId,
      });

    case "PosedQuestionEvent":
      // May be resuming, redirect to the question page
      return new PoseQuestionAction({ questionId: lastEvent.questionId });

    case "ShowedGardenEvent":
      // May be resuming, redirect to the garden page
      return ShowGardenAction.instance;
  }
};
