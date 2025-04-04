import { Timestamp } from "~/models";
import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = ({ event, log }) => {
  return {
    actionType: "QuestionAction",
    identifier: "single-likert-scale-question",
    logEntryType: "Action",
    question: {
      item: `Is this the best app ever? (iteration ${log.length + 1})`,
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
