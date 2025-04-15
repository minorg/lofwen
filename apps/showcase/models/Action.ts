import type { NopAction } from "~/models/NopAction";
import type { PoseQuestionAction } from "~/models/PoseQuestionAction";
import type { ScheduleNotificationAction } from "~/models/ScheduleNotificationAction";

export type Action =
  | NopAction
  | PoseQuestionAction
  | ScheduleNotificationAction;
