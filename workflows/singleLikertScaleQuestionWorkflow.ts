import { workflowSingleton } from "~/workflowSingleton";
import type { Workflow } from "~/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = async ({ history }) => {
  return {
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
    type: "QuestionAction",
  };
};

workflowSingleton.value = singleLikertScaleQuestionWorkflow;
