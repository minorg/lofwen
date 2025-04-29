import { Identifier, Timestamp } from "@lofwen/models";
import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompleteChatAction } from "~/models/CompleteChatAction";
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
import { SendChatMessageAction } from "~/models/SendChatMessageAction";
import { ShowGardenAction } from "~/models/ShowGardenAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("workflow");

const questionnaires: Record<string, Questionnaire> = {
  onboarding: {
    items: [
      {
        "@id": "onboarding-pre-instructions",
        "@type": "Instructions",
        title: "Welcome!",
        text: "We'd like to get to know you and tailor a better experience for you. You're going to be asked a series of questions about yourself, your emotions, and your life. Answer the questions to the best of your ability. There are no right or wrong answers.",
      },
      ...PerceivedStressScale.questions.map((question) => {
        const { "@id": questionId, ...otherQuestionProperties } = question;
        return {
          "@id": `onboarding-${questionId}`,
          ...otherQuestionProperties,
        };
      }),
      {
        "@id": "onboarding-post-instructions",
        "@type": "Instructions",
        title: "Thank you.",
        text: "Thank you for filling out these questions! We have set up the app in the way we think will work best for you based on your responses. Please feel free to explore and set up your garden!",
      },
    ],
  },
  shovel: {
    items: [
      {
        "@id": "shovel-instructions",
        "@type": "Instructions",
        title: "Shovel",
        text: `\
Throughout our day, we can experience highs and lows, positive and negative emotions. An emotional experience can be caused by an external event (e.g. enjoyed a walk in the park, had a fight with someone dear) or by internal thoughts (e.g. imagined a pleasant future, remembered a painful memory). It can be positive or negative, and range from being intense (e.g. ecstatic because of a promotion, furious at a friend’s negative comment) to mild/barely noticeable (e.g. having a nice cup of tea, slightly irritated at slow internet).

These experiences might cause specific emotions, and it can be helpful to put a label to what you are feeling.
`,
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
              text: "The shovel is a prerequisite to plant your garden, just like completing the initial assessments are a prerequisite for us to craft the just right solution for each individual. Acquire the shovel once you’ve completed these tasks. The shovel can be used to dig holes to place your seeds. You can dig one hole per assessment completed.",
              title: "Shovel",
            },
            {
              "@id": "water",
              icon: {
                family: "MaterialCommunityIcons",
                name: "sprinkler",
              },
              text: "The ultimate nourishment for your garden. Water is acquired in certain amounts each time you complete a task of any kind. Water is required for your plants to grow and flourish and flower (or fruit or vegetable!). Water your plants everyday!",
              title: "Water",
            },
            {
              "@id": "seed",
              icon: {
                family: "MaterialCommunityIcons",
                name: "seed",
              },
              text: "The start of life pellet required to launch the greenery in your garden. Select among our catalog of seeds to be placed in the holes you dig with your shovel. Seeds are acquired after completing training modules or providing social support to others in the forum. Some seeds are available only after certain tasks are completed.",
              title: "Seeds",
            },
            {
              "@id": "fertilizer",
              icon: {
                family: "MaterialCommunityIcons",
                name: "sack",
              },
              text: "Food for your plants. Fertilizer is acquired when you put your training to use or make a daily diary entry. You put your training to use when you apply an interventional strategy and answer questions about it. Each time these tasks are completed you acquire enough fertilizer to feed one plant.",
              title: "Fertilizer",
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

    case "OpenedChatEvent": {
      if (
        !eventLog.some((event) => event["@type"] === "SentChatMessageEvent")
      ) {
        return new SendChatMessageAction({
          chatMessage: {
            _id: Identifier.random(),
            createdAt: Timestamp.now(),
            role: "assistant",
            text: "How are you feeling today?",
            user: {
              _id: "system",
            },
          },
        });
      }

      return NopAction.instance;
    }

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

    case "SentChatMessageEvent": {
      if (lastEvent.chatMessage.role !== "user") {
        return NopAction.instance;
      }
      return CompleteChatAction.instance;
    }

    case "ShowedGardenEvent":
      // May be resuming, redirect to the garden page
      return ShowGardenAction.instance;
  }
};
