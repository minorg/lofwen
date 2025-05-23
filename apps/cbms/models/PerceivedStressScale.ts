import type { LikertScaleAnswer, LikertScaleQuestion } from "@lofwen/models";
import invariant from "ts-invariant";
import { z } from "zod";

/**
 * Perceived Stress Scale (PSS), public domain.
 *
 * https://www.das.nh.gov/wellness/docs/percieved%20stress%20scale.pdf
 */
export namespace PerceivedStressScale {
  const responseCategoryLabels = [
    "never",
    "almost never",
    "sometimes",
    "fairly often",
    "very often",
  ];

  export const questions: readonly LikertScaleQuestion[] = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    // "In the last month, how often have you felt that you were unable to control the important things in your life?",
    // "In the last month, how often have you felt nervous and stressed?",
    // "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    // "In the last month, how often have you felt that things were going your way?",
    // "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    // "In the last month, how often have you been able to control irritations in your life?",
    // "In the last month, how often have you felt that you were on top of things?",
    // "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    // "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  ].map((prompt, questionIndexZeroBased) => {
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
      "@type": "LikertScaleQuestion",
      prompt,
      title: "Perceived Stress Scale",
      responseCategories: responseCategoryLabels.map(
        (responseCategoryLabel, responseCategoryI) => ({
          label: responseCategoryLabel,
          value: responseCategoryValues[responseCategoryI],
        }),
      ),
    };
  });

  export type Scores = z.infer<typeof Scores.schema>;

  export namespace Scores {
    export const schema = z.object({
      category: z.enum(["low stress", "moderate stress", "high stress"]),
      total: z.number(),
    });
  }

  export function score(answers: readonly LikertScaleAnswer[]): Scores {
    invariant(answers.length === questions.length);
    const total = questions.reduce((totalScore, _, questionI) => {
      return totalScore + answers[questionI].responseCategory.value;
    }, 0);

    let category: Scores["category"];
    if (total >= 0 && total <= 13) {
      category = "low stress";
    } else if (total >= 14 && total <= 26) {
      category = "moderate stress";
    } else if (total >= 17 && total <= 40) {
      category = "high stress";
    } else {
      invariant(total <= 40, total);
      throw new Error();
    }

    return {
      category,
      total: total,
    };
  }
}
