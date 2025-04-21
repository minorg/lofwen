import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Hrefs } from "~/Hrefs";
import type { Instructions } from "~/models/Instructions";
import { RenderableAction } from "~/models/RenderableAction";

export class GiveInstructionsAction extends RenderableAction {
  readonly instructions: Instructions;

  constructor({ instructions }: { instructions: Instructions }) {
    super();
    this.instructions = instructions;
  }

  override render(): ReactNode {
    return <Redirect href={Hrefs.instructions(this.instructions)} />;
  }

  override toString(): string {
    return `GiveInstructionsAction(@id=${this.instructions["@id"]}))`;
  }
}
