import invariant from "ts-invariant";
import { logger } from "~/logger";
import {
  type Identifier,
  type LikertScaleQuestionAction,
  Timestamp,
} from "~/models";
import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const questionItems = [
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
];

const responseCategoryLabels = [
  "never",
  "almost never",
  "sometimes",
  "fairly often",
  "very often",
];

function questionAction({
  predecessor,
  questionIndexZeroBased,
}: {
  predecessor: Identifier;
  questionIndexZeroBased: number;
}): LikertScaleQuestionAction {
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
    actionType: "LikertScaleQuestionAction",
    identifier: `pss-${questionIndexZeroBased + 1}`,
    item: questionItems[questionIndexZeroBased],
    logEntryType: "Action",
    predecessor,
    responseCategories: responseCategoryLabels.map(
      (responseCategoryLabel, responseCategoryI) => ({
        label: responseCategoryLabel,
        value: responseCategoryValues[responseCategoryI],
      }),
    ),
    timestamp: Timestamp.now(),
  };
}

/**
 * Perceived Stress Scale (PSS), public domain.
 *
 * https://www.das.nh.gov/wellness/docs/percieved%20stress%20scale.pdf
 */
const perceivedStressScaleWorkflow: Workflow = ({ event }) => {
  switch (event.eventType) {
    case "LikertScaleAnswerEvent": {
      const questionActionIdentifierMatch =
        event.predecessor.match(/pss-(\d+)/);
      invariant(questionActionIdentifierMatch, event.predecessor);
      const questionIndexZeroBased =
        Number.parseInt(questionActionIdentifierMatch[1]) - 1;
      invariant(
        questionIndexZeroBased >= 0 &&
          questionIndexZeroBased < questionItems.length,
      );
      logger.debug(
        "answered question index (0-based):",
        questionIndexZeroBased,
      );
      if (questionIndexZeroBased + 1 < questionItems.length) {
        return questionAction({
          questionIndexZeroBased: questionIndexZeroBased + 1,
          predecessor: event.identifier,
        });
      }
      throw new Error("not implemented");
    }
    case "InitialEvent":
      return questionAction({
        questionIndexZeroBased: 0,
        predecessor: event.identifier,
      });
  }
};

workflows["perceivedStressScale"] = perceivedStressScaleWorkflow;
