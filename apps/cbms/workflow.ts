import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompleteOnboardingAction } from "~/models/CompleteOnboardingAction";
import type { EventLog } from "~/models/EventLog";
import { FormulateGardenAction } from "~/models/FormulateGardenAction";
import { FormulateInstructionsAction } from "~/models/FormulateInstructionsAction";
import { FormulateQuestionAction } from "~/models/FormulateQuestionAction";
import { GiveInstructionsAction } from "~/models/GiveInstructionsAction";
import { NopAction } from "~/models/NopAction";
import { PerceivedStressScale } from "~/models/PerceivedStressScale";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import type { Question } from "~/models/Question";
import type { Questionnaire } from "~/models/Questionnaire";
import type { QuestionnaireItem } from "~/models/QuestionnaireItem";
import { ShowGardenAction } from "~/models/ShowGardenAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("workflow");

const questionnaires: Record<string, Questionnaire> = {
  onboarding: {
    items: [
      {
        "@id": "onboarding-instructions",
        "@type": "Instructions",
        title: "Onboarding instructions",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      ...PerceivedStressScale.questions.map((question) => {
        const { "@id": questionId, ...otherQuestionProperties } = question;
        return {
          "@id": `onboarding-${questionId}`,
          ...otherQuestionProperties,
        };
      }),
    ],
  },
  shovel: {
    items: [
      {
        "@id": "shovel-instructions",
        "@type": "Instructions",
        title: "Shovel instructions",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  },
};

export const workflow = ({ eventLog }: { eventLog: EventLog }): Action => {
  const questionnaireItemAction = (
    questionnaireItem: QuestionnaireItem,
  ): Action => {
    if (questionnaireItem["@type"] === "Instructions") {
      const instructions = questionnaireItem;

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
        instructions: questionnaireItem,
      });
    }

    const question: Question = questionnaireItem;
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
      question: questionnaireItem,
    });
  };

  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    logger.debug("no last event, starting onboarding");
    return questionnaireItemAction(questionnaires["onboarding"].items[0]);
  }
  logger.debug(`last event type: ${lastEvent["@type"]}`);

  switch (lastEvent["@type"]) {
    case "AcknowledgedInstructionsEvent":
    case "AnsweredQuestionEvent": {
      let questionnaire: Questionnaire;
      let questionnaireItemIndex: number;
      if (lastEvent["@type"] === "AcknowledgedInstructionsEvent") {
        questionnaire =
          questionnaires[lastEvent.instructionsId.split("-", 2)[0]];
        invariant(
          questionnaire,
          `no such questionnaire: ${lastEvent.instructionsId}`,
        );
        questionnaireItemIndex = questionnaire.items.findIndex(
          (instructions) =>
            instructions["@type"] === "Instructions" &&
            instructions["@id"] === lastEvent.instructionsId,
        );
      } else {
        questionnaire = questionnaires[lastEvent.questionId.split("-", 2)[0]];
        invariant(
          questionnaire,
          `no such questionnaire: ${lastEvent.questionId}`,
        );
        questionnaireItemIndex = questionnaire.items.findIndex(
          (question) =>
            question["@type"] !== "Instructions" &&
            question["@id"] === lastEvent.questionId,
        );
      }
      invariant(
        questionnaireItemIndex >= 0 &&
          questionnaireItemIndex < questionnaire.items.length,
      );
      logger.debug(
        `answered/acknowledged onboarding sequence index (0-based): ${questionnaireItemIndex}`,
      );
      if (questionnaireItemIndex + 1 < questionnaire.items.length) {
        return questionnaireItemAction(
          questionnaire.items[questionnaireItemIndex + 1],
        );
      }

      // End of onboarding sequence
      return new CompleteOnboardingAction({
        perceivedStressScaleScores: PerceivedStressScale.score(
          PerceivedStressScale.questions.map((question) => {
            const questionId = `onboarding-${question["@id"]}`;
            const answer = (
              eventLog.find(
                (event) =>
                  event["@type"] === "AnsweredQuestionEvent" &&
                  event.questionId === questionId,
              ) as AnsweredQuestionEvent | null
            )?.answer;
            invariant(answer, `no answer for question ${questionId}`);
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
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              title: "Shovel",
            },
            {
              "@id": "trowel",
              icon: {
                family: "FontAwesome6",
                name: "trowel",
              },
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              title: "Trowel",
            },
            {
              "@id": "seed",
              icon: {
                family: "MaterialCommunityIcons",
                name: "seed",
              },
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              title: "Seeds",
            },
            {
              "@id": "water",
              icon: {
                family: "FontAwesome6",
                name: "water",
              },
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              title: "Water",
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

    case "SelectedGardenItemEvent": {
      const questionnaire = questionnaires[lastEvent.gardenItem["@id"]];
      if (!questionnaire) {
        logger.warn(`no such questionnaire: ${lastEvent.gardenItem["@id"]}`);
        return NopAction.instance;
      }
      return questionnaireItemAction(questionnaire.items[0]);
    }

    case "ShowedGardenEvent":
      // May be resuming, redirect to the garden page
      return ShowGardenAction.instance;
  }
};
