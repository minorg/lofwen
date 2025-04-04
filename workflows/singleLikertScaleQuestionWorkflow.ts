import { Timestamp } from "~/models";
import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = ({ event, log }) => {
  const iteration = [...log.actions()].length;
  return {
    actionType: "QuestionAction",
    identifier: `single-likert-scale-question-${iteration}`,
    logEntryType: "Action",
    question: {
      item: `Is this the best app ever? (iteration ${iteration})`,
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
      questionType: "LikertScaleQuestion",
    },
    timestamp: Timestamp.now(),
    triggerEventIdentifier: event.identifier,
  };
};

workflows["singleLikertScaleQuestion"] = singleLikertScaleQuestionWorkflow;
