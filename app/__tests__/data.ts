import type {
  AcknowledgmentAction,
  Action,
  Event,
  LikertScaleQuestionAction,
  TextQuestionAction,
} from "~/models";

export const initialEvent: Event = {
  "@type": "InitialEvent",
};

export const acknowledgmentAction: AcknowledgmentAction = {
  "@id": "acknowledgment",
  "@type": "AcknowledgmentAction",
  message: "Test message",
  title: "Acknowledgment",
};

export const likertScaleQuestionAction: LikertScaleQuestionAction = {
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
};

export const questionAction: Action = likertScaleQuestionAction;

export const textQuestionAction: TextQuestionAction = {
  "@id": "text-question",
  "@type": "TextQuestionAction",
  prompt: "Tell us what you like about the app.",
  title: "Text question",
};
