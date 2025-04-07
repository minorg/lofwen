import { type LikertScaleQuestionAction, Timestamp } from "~/models";
import type { Workflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";

const singleLikertScaleQuestionWorkflow: Workflow = ({
  event,
  log,
}): LikertScaleQuestionAction => {
  const iteration = [...log.actions()].length;
  return {
    "@id": `single-likert-scale-question-${iteration}`,
    "@predecessor": event["@id"],
    "@timestamp": Timestamp.now(),
    "@type": "LikertScaleQuestionAction",
    item: `Is this the best app ever? (iteration ${iteration})`,
    label: "Single Likert scale question",
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
  };
};

workflows["singleLikertScaleQuestion"] = singleLikertScaleQuestionWorkflow;
