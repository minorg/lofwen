import type { Identifier } from "@lofwen/models";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Hrefs } from "~/Hrefs";
import { RenderableAction } from "~/models/RenderableAction";

export class GiveInstructionsAction extends RenderableAction {
  readonly instructionsId: Identifier;

  constructor({ instructionsId }: { instructionsId: Identifier }) {
    super();
    this.instructionsId = instructionsId;
  }

  override render(): ReactNode {
    return (
      <Redirect href={Hrefs.instructions({ "@id": this.instructionsId })} />
    );
  }

  override toString(): string {
    return `GiveInstructionsAction(instructionsId=${this.instructionsId}))`;
  }
}
