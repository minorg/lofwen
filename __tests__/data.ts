import {
  type AcknowledgmentAction,
  type Action,
  type Event,
  type LikertScaleQuestionAction,
  Timestamp,
} from "~/models";

export const initialEvent: Event = {
  eventType: "InitialEvent",
  identifier: "initial-event",
  logEntryType: "Event",
  predecessor: "initial-event",
  timestamp: Timestamp.now(),
};

export const acknowledgmentAction: AcknowledgmentAction = {
  actionType: "AcknowledgmentAction",
  identifier: "acknowledgment",
  message: "Test message",
  logEntryType: "Action",
  predecessor: initialEvent.identifier,
  timestamp: Timestamp.now(),
};

export const likertScaleQuestionAction: LikertScaleQuestionAction = {
  actionType: "LikertScaleQuestionAction",
  item: "Is this the best app ever?",
  identifier: "likert-scale-question",
  logEntryType: "Action",
  predecessor: initialEvent.identifier,
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

export const questionAction: Action = likertScaleQuestionAction;
