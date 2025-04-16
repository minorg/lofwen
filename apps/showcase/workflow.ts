import type { EventLog } from "@lofwen/event-log";
import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";
import { NopAction } from "~/models/NopAction";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";
import { rootLogger } from "~/rootLogger";

const actions: readonly Action[] = [
  new PoseQuestionAction({
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
  }),
  new PoseQuestionAction({
    "@id": "text-question",
    "@type": "TextQuestion",
    prompt: "Tell us what you think of the app.",
    title: "Text question",
  }),
  new ScheduleNotificationAction({
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
  }),
  new NopAction(),
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
    case "QuestionPosedEvent": {
      // Return the PoseQuestionAction again so the workflow is deterministic
      return actions.find(
        (action) =>
          action instanceof PoseQuestionAction &&
          action.question["@id"] === lastEvent.question["@id"],
      )!;
    }
    case "QuestionAnsweredEvent": {
      // Pose the next question
      currentActionIndex = actions.findIndex(
        (action) =>
          action instanceof PoseQuestionAction &&
          action.question["@id"] === lastEvent.answer.questionId,
      );
      break;
    }
    case "NotificationScheduledEvent": {
      currentActionIndex = actions.findIndex(
        (action) => action instanceof ScheduleNotificationAction,
      );
      break;
    }
  }
  invariant(currentActionIndex >= 0);
  logger.debug(`current action: ${actions[currentActionIndex]}`);
  const nextAction = actions[currentActionIndex + 1];
  invariant(nextAction);
  logger.debug(`next action: ${nextAction}`);
  return nextAction;
};
