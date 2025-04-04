import type { Action, Event, Log } from "~/models";

/**
 * A workflow is a (usually pure) function that accepts an event and returns the next action to take.
 *
 * For example, the event might be an answer to a question, and the next action might be another question.
 *
 * The history of actions and events is provided as a convenience.
 */
export type Workflow = (parameters: {
  event: Event;
  log: Log;
}) => Action;
