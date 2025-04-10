import invariant from "ts-invariant";
import type { Action } from "~/models";
import type { Workflow } from "~/workflows";

const actions: readonly ReturnType<Workflow>[] = [
  {
    "@id": "likert-scale-question",
    "@type": "LikertScaleQuestionAction",
    prompt: "Is this the best app ever?",
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
    title: "Likert scale question",
  },
  {
    "@id": "text-question",
    "@type": "TextQuestionAction",
    prompt: "Tell us what you think of the app.",
    title: "Likert scale question",
  },
  {
    "@id": "acknowledgment",
    "@type": "AcknowledgmentAction",
    message: "Show a score or other summary here.",
    title: "Acknowledgment",
  },
];

export const showcaseWorkflow: Workflow = ({ log }): Action => {
  const lastAction = log.lastAction;
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
