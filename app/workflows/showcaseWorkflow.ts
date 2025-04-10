import invariant from "ts-invariant";
import type { Action } from "~/models";
import type { Workflow } from "~/workflows";

const actions: readonly ReturnType<Workflow>[] = [
  {
    "@id": "likert-scale-question",
    "@type": "LikertScaleQuestionAction",
    item: "Is this the best app ever?",
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
    title: "Single Likert scale question",
  },
];

export const showcaseWorkflow: Workflow = ({ log }): Action => {
  const lastAction = log.lastActionEntry?.action ?? null;
  if (lastAction === null) {
    return actions[0];
  }

  const lastActionIndex = actions.findIndex(
    (action) => action["@id"] === lastAction["@id"],
  );
  const nextAction = actions[lastActionIndex + 1];
  invariant(nextAction);
  return nextAction;
};
