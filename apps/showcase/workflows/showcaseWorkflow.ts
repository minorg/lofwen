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
    "@id": "schedule-notification",
    "@type": "ScheduleNotificationAction",
    content: {
      body: "Notification body",
      title: "Notification title",
    },
    identifier: "showCaseNotification",
    trigger: {
      repeats: false,
      seconds: 5,
      type: "timeInterval",
    },
  },
  {
    "@id": "acknowledgment",
    "@type": "AcknowledgmentAction",
    message: "Show a score or other summary here.",
    title: "Acknowledgment",
  },
];

export const showcaseWorkflow: Workflow = ({ event }): Action => {
  let nextActionIndex: number;
  switch (event["@type"]) {
    case "InitialEvent":
      nextActionIndex = 0;
      break;
    case "LikertScaleAnswerEvent":
    case "TextAnswerEvent": {
      nextActionIndex =
        actions.findIndex(
          (action) => action["@id"] === event.questionActionId,
        ) + 1;
      break;
    }
    case "ScheduledNotificationEvent":
      nextActionIndex =
        actions.findIndex(
          (action) => action["@id"] === event.scheduleNotificationActionId,
        ) + 1;
      break;
  }
  const nextAction = actions[nextActionIndex];
  invariant(nextAction);
  return nextAction;
};
