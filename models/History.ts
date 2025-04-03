import type { Action } from "~/models/Action";
import type { Event } from "~/models/Event";

/**
 * History of actions and events in the workflow with additional convenience accessors to e.g., extract answers.
 */
export interface History {
  readonly actions: readonly Action[];
  readonly events: readonly Event[];
}
