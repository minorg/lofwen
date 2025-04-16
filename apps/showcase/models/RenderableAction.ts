import type { ReactNode } from "react";
import { Action } from "~/models/Action";

/**
 * An action that should be returned from a React component's render function. Typically a Redirect to another page.
 */
export abstract class RenderableAction extends Action {
  abstract render(): ReactNode;
}
