import type { ReactNode } from "react";
import { Action } from "~/models/Action";

export abstract class RenderableAction extends Action {
  abstract render(): ReactNode;
}
