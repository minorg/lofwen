import type { Action } from "~/models/Action";

/**
 * History of actions and events in the workflow with additional convenience accessors to e.g., extract answers.
 */
export interface History {
  readonly actions: readonly Action[];
}
