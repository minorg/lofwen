import type { Identifier } from "@lofwen/models";
import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";

export class GiveInstructionsAction extends Action {
  readonly instructionsId: Identifier;

  constructor({ instructionsId }: { instructionsId: Identifier }) {
    super();
    this.instructionsId = instructionsId;
  }

  override async execute({
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    router.push(Hrefs.instructions({ "@id": this.instructionsId }));
  }

  override toString(): string {
    return `GiveInstructionsAction(instructionsId=${this.instructionsId}))`;
  }
}
