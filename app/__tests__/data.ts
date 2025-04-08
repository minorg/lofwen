import {
  type AcknowledgmentAction,
  type Action,
  type Event,
  type LikertScaleQuestionAction,
  Timestamp,
} from "~/models";

export const initialEvent: Event = {
  "@id": "initial-event",
  "@predecessor": "initial-event",
  "@type": "InitialEvent",
  "@timestamp": Timestamp.now(),
};

export const acknowledgmentAction: AcknowledgmentAction = {
  "@id": "acknowledgment",
  "@predecessor": initialEvent["@id"],
  "@timestamp": Timestamp.now(),
  "@type": "AcknowledgmentAction",
  message: "Test message",
};

export const likertScaleQuestionAction: LikertScaleQuestionAction = {
  "@id": "likert-scale-question",
  "@predecessor": initialEvent["@id"],
  "@timestamp": Timestamp.now(),
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
};

export const questionAction: Action = likertScaleQuestionAction;
