import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Hrefs } from "~/Hrefs";
import { RenderableAction } from "~/models/RenderableAction";

export class OpenChatAction extends RenderableAction {
  static readonly instance = new OpenChatAction();

  private constructor() {
    super();
  }

  override render(): ReactNode {
    return <Redirect href={Hrefs.chat} />;
  }

  override toString(): string {
    return "OpenChatAction()";
  }
}
