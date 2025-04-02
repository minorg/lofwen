import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = async ({
  event,
  history,
}) => {
  return {
    identifier: "single-likert-scale-question",
    question: {
      item: `Is this the best app ever? (iteration ${history.actions.length + 1})`,
      responseCategories: [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
      ].map((label, index) => ({
        label,
        value: index,
      })),
      type: "LikertScaleQuestion",
    },
    triggerEvent: event,
    type: "QuestionAction",
  };
};

workflows["singleLikertScaleQuestion"] = singleLikertScaleQuestionWorkflow;
