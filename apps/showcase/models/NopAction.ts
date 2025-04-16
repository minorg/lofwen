import { Action } from "~/models/Action";

export class NopAction extends Action {
  override toString(): string {
    return "NopAction";
  }
}
