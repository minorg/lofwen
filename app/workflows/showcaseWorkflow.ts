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
    title: "Text question",
  },
  {
    "@id": "acknowledgment",
    "@type": "AcknowledgmentAction",
    message: "Show a score or other summary here.",
    title: "Acknowledgment",
  },
];

export const showcaseWorkflow: Workflow = ({ event }): Action => {
  switch (event["@type"]) {
    case "InitialEvent":
      return actions[0];
    case "LikertScaleAnswerEvent":
    case "TextAnswerEvent": {
      const questionIndex = actions.findIndex(
        (action) => action["@id"] === event.questionActionId,
      );
      const nextAction = actions[questionIndex + 1];
      invariant(nextAction);
      return nextAction;
    }
  }
};
