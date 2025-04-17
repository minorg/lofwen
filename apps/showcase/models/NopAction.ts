import { Action } from "~/models/Action";

/**
 * An action that is neither executable nor renderable but leaves the current page as-is, possibly until some subsequent event occurs.
 */
export class NopAction extends Action {
  static readonly instance = new NopAction();

  private constructor() {
    super();
  }

  override toString(): string {
    return "NopAction";
  }
}
