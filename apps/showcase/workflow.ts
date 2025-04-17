import type { User } from "@lofwen/auth";
import type { EventLog } from "@lofwen/event-log";
import { Identifier, Timestamp } from "@lofwen/models";
import invariant from "ts-invariant";
import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";
import { NopAction } from "~/models/NopAction";
import { OpenChatAction } from "~/models/OpenChatAction";
import { PoseQuestionAction } from "~/models/PoseQuestionAction";
import { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";
import { SendChatMessageAction } from "~/models/SendChatMessageAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("workflow");

export const workflow = ({
  eventLog,
  user,
}: { eventLog: EventLog<Event>; user: User }): Action => {
  const lastEvent = eventLog.last;
  if (lastEvent === null) {
    return NopAction.instance;
  }

  logger.debug("last event:", JSON.stringify(lastEvent));

  switch (lastEvent["@type"]) {
    // Cases are in order of the workflow
    case "StartedAppEvent": {
      return new PoseQuestionAction({
        question: {
          "@id": "likert-scale-question",
          "@type": "LikertScaleQuestion",
          prompt: "Is this the **best** app ever?",
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
      });
    }
    case "PosedQuestionEvent": {
      // Return the PoseQuestionAction again so the workflow is deterministic
      return new PoseQuestionAction({ question: lastEvent.question });
    }
    case "AnsweredQuestionEvent":
      switch (lastEvent.answer.questionId) {
        case "likert-scale-question":
          return new PoseQuestionAction({
            question: {
              "@id": "text-question",
              "@type": "TextQuestion",
              prompt: "Tell us what you *think* of the app.",
              title: "Text question",
            },
          });
        case "text-question":
          return new ScheduleNotificationAction({
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
          });
        default:
          throw new RangeError(lastEvent.answer.questionId);
      }
    case "ScheduledNotificationEvent": {
      return OpenChatAction.instance;
    }
    case "OpenedChatEvent": {
      return new SendChatMessageAction({
        chatMessage: {
          _id: Identifier.random(),
          createdAt: Timestamp.now(),
          text: "How are you feeling today?",
          user: {
            _id: "system",
            name: "System",
          },
        },
      });
    }
    case "SentChatMessageEvent": {
      if (
        user["@type"] === "AuthenticatedUser" &&
        lastEvent.chatMessage.user._id === user["@id"]
      ) {
        return new SendChatMessageAction({
          chatMessage: {
            _id: Identifier.random(),
            createdAt: Timestamp.now(),
            text: "How does that make you feel?",
            user: {
              _id: "system",
              name: "System",
            },
          },
        });
      }

      invariant(lastEvent.chatMessage.user._id === "system");
      return NopAction.instance;
    }
    default:
      throw new RangeError(lastEvent["@type"]);
  }
};
