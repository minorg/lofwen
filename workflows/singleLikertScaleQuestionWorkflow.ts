import { type LikertScaleQuestionAction, Timestamp } from "~/models";
import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = ({
  event,
  log,
}): LikertScaleQuestionAction => {
  const iteration = [...log.actions()].length;
  return {
    actionType: "LikertScaleQuestionAction",
    identifier: `single-likert-scale-question-${iteration}`,
    item: `Is this the best app ever? (iteration ${iteration})`,
    label: "Single Likert scale question",
    logEntryType: "Action",
    predecessor: event.identifier,
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
    timestamp: Timestamp.now(),
  };
};

workflows["singleLikertScaleQuestion"] = singleLikertScaleQuestionWorkflow;
