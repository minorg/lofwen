import type {
  AcknowledgmentAction,
  Action,
  Event,
  LikertScaleQuestionAction,
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
  title: "Likert scale question",
};

export const questionAction: Action = likertScaleQuestionAction;
