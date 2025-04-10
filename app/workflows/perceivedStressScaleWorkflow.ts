import invariant from "ts-invariant";
import { logger } from "~/logger";
import type {
  AcknowledgmentAction,
  LikertScaleAnswerEvent,
  LikertScaleQuestionAction,
} from "~/models";
import type { Workflow } from "~/workflows";

const responseCategoryLabels = [
  "never",
  "almost never",
  "sometimes",
  "fairly often",
  "very often",
];

const questions: readonly LikertScaleQuestionAction[] = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that happened that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
].map((item, questionIndexZeroBased) => {
  let responseCategoryValues: readonly number[];
  switch (questionIndexZeroBased + 1) {
    case 4:
    case 5:
    case 7:
    case 8:
      // Questions 4, 5, 7, and 8 have inverted scores
      responseCategoryValues = [4, 3, 2, 1, 0];
      break;
    default:
      responseCategoryValues = [0, 1, 2, 3, 4];
      break;
  }

  return {
    "@id": `pss-${questionIndexZeroBased + 1}`,
    "@type": "LikertScaleQuestionAction",
    item,
    title: "Perceived Stress Scale",
    responseCategories: responseCategoryLabels.map(
      (responseCategoryLabel, responseCategoryI) => ({
        label: responseCategoryLabel,
        value: responseCategoryValues[responseCategoryI],
      }),
    ),
  };
});

/**
 * Perceived Stress Scale (PSS), public domain.
 *
 * https://www.das.nh.gov/wellness/docs/percieved%20stress%20scale.pdf
 */
export const perceivedStressScaleWorkflow: Workflow = ({ event, log }) => {
  switch (event["@type"]) {
    case "LikertScaleAnswerEvent": {
      const questionIndexZeroBased = questions.findIndex(
        (questionAction) => questionAction["@id"] === event.questionActionId,
      );
      invariant(
        questionIndexZeroBased >= 0 &&
          questionIndexZeroBased < questions.length,
      );
      logger.debug(
        "answered question index (0-based):",
        questionIndexZeroBased,
      );
      if (questionIndexZeroBased + 1 < questions.length) {
        // Questions remaining
        return questions[questionIndexZeroBased + 1];
      }

      // Last question answered

      const totalScore = questions.reduce((totalScore, question) => {
        const answer = log.find(
          (entry) =>
            entry["@type"] === "EventLogEntry" &&
            entry.event["@type"] === "LikertScaleAnswerEvent" &&
            entry.event.questionActionId === question["@id"],
        ) as LikertScaleAnswerEvent | null;
        invariant(answer, `no answer for question ${question["@id"]}`);
        return totalScore + answer.responseCategory.value;
      }, 0);

      let perceivedStress: string;
      if (totalScore >= 0 && totalScore <= 13) {
        perceivedStress = "low stress";
      } else if (totalScore >= 14 && totalScore <= 26) {
        perceivedStress = "moderate stress";
      } else if (totalScore >= 17 && totalScore <= 40) {
        perceivedStress = "high stress";
      } else {
        invariant(totalScore <= 40, totalScore);
        throw new Error();
      }

      return {
        "@id": "pss-acknowledgment",
        "@type": "AcknowledgmentAction",
        message: `Your perceived stress: ${perceivedStress} (total score: ${totalScore})`,
        title: "Perceived Stress Scale",
      } satisfies AcknowledgmentAction;
    }
    case "InitialEvent":
      return questions[0];
  }
};
