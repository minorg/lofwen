import type { EventLog } from "@lofwen/event-log";
import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";

const actions: readonly Action[] = [
  {
    "@type": "PoseQuestionAction",
    question: {
      "@id": "likert-scale-question",
      "@type": "LikertScaleQuestion",
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
  },
  {
    "@type": "PoseQuestionAction",
    question: {
      "@id": "text-question",
      "@type": "TextQuestion",
      prompt: "Tell us what you think of the app.",
      title: "Text question",
    },
  },
  {
    "@type": "ScheduleNotificationAction",
    content: {
      body: "Notification body",
      title: "Notification title",
    },
    identifier: "showcaseNotification",
    trigger: {
      repeats: false,
      seconds: 5,
      type: "timeInterval",
    },
  },
];

export const workflow = ({
  eventLog,
}: { eventLog: EventLog<Event> }): Action => {
  const lastEvent = eventLog.last;
  invariant(lastEvent !== null);

  let nextActionIndex: number;
  switch (lastEvent["@type"]) {
    case "AppStartedEvent": {
      nextActionIndex = 0;
      break;
    }
    case "QuestionFormulatedEvent": {
      // Pose the question
      nextActionIndex =
        actions.findIndex(
          (action) =>
            action["@type"] === "PoseQuestionAction" &&
            action.question["@id"] === lastEvent.question["@id"],
        ) + 1;
      break;
    }
    case "QuestionPosedEvent": {
      // Re-pose the question
      nextActionIndex =
        actions.findIndex(
          (action) =>
            action["@type"] === "PoseQuestionAction" &&
            action.question["@id"] === lastEvent.questionId,
        ) + 1;
      break;
    }
    case "QuestionAnsweredEvent": {
      // Pose the next question
      nextActionIndex =
        actions.findIndex(
          (action) =>
            action["@type"] === "PoseQuestionAction" &&
            action.question["@id"] === lastEvent.answer.questionId,
        ) + 1;
      break;
    }
    case "NotificationScheduledEvent": {
      nextActionIndex =
        actions.findIndex(
          (action) => action["@type"] === "ScheduleNotificationAction",
        ) + 1;
      break;
    }
  }
  const nextAction = actions[nextActionIndex];
  invariant(nextAction);
  return nextAction;
};
