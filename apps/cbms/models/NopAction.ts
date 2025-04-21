import { ExecutableAction } from "~/models/ExecutableAction";

/**
 * An action that is neither executable nor renderable but leaves the current page as-is, possibly until some subsequent event occurs.
 */
export class NopAction extends ExecutableAction {
  static readonly instance = new NopAction();

  private constructor() {
    super();
  }

  override async execute(): Promise<void> {}

  override toString(): string {
    return "NopAction";
  }
}
