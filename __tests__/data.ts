import { type Action, type Event, type Question, Timestamp } from "~/models";

export const initialEvent: Event = {
  identifier: "initial-event",
  timestamp: Timestamp.now(),
  type: "InitialEvent",
};

export const likertScaleQuestion: Question = {
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
  type: "LikertScaleQuestion",
};

export const questionAction: Action = {
  identifier: "question-action",
  question: likertScaleQuestion,
  timestamp: Timestamp.now(),
  triggerEventIdentifier: initialEvent.identifier,
  type: "QuestionAction",
};
