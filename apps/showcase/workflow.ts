import type { EventLog } from "@lofwen/event-log";
import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";
import { rootLogger } from "~/rootLogger";

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
  {
    "@type": "NopAction",
  },
];

const logger = rootLogger.extend("workflow");

export const workflow = ({
  eventLog,
}: { eventLog: EventLog<Event> }): Action => {
  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    return actions[0];
  }

  logger.debug("last event:", JSON.stringify(lastEvent));

  let currentActionIndex: number;
  switch (lastEvent["@type"]) {
    case "QuestionFormulatedEvent": {
      // Pose the question
      currentActionIndex = actions.findIndex(
        (action) =>
          action["@type"] === "PoseQuestionAction" &&
          action.question["@id"] === lastEvent.question["@id"],
      );
      break;
    }
    case "QuestionPosedEvent": {
      // Re-pose the question
      currentActionIndex = actions.findIndex(
        (action) =>
          action["@type"] === "PoseQuestionAction" &&
          action.question["@id"] === lastEvent.questionId,
      );
      break;
    }
    case "QuestionAnsweredEvent": {
      // Pose the next question
      currentActionIndex = actions.findIndex(
        (action) =>
          action["@type"] === "PoseQuestionAction" &&
          action.question["@id"] === lastEvent.answer.questionId,
      );
      break;
    }
    case "NotificationScheduledEvent": {
      currentActionIndex = actions.findIndex(
        (action) => action["@type"] === "ScheduleNotificationAction",
      );
      break;
    }
  }
  invariant(currentActionIndex >= 0);
  logger.debug("current action index:", currentActionIndex);
  const nextAction = actions[currentActionIndex + 1];
  invariant(nextAction);
  return nextAction;
};
