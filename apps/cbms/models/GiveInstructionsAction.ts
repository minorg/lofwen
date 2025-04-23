import type { Identifier } from "@lofwen/models";
import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("GiveInstructionsAction");

/**
 * Redirect to the instructions page.
 *
 * Assumes the Instructions referenced by instructionsId have already been added to the event log as a FormulatedInstructionsEvent by FormulateInstructionsAction.
 *
 * See notes in FormulateInstructionsAction re: the action-event sequence.
 */
export class GiveInstructionsAction extends Action {
  readonly instructionsId: Identifier;

  constructor({ instructionsId }: { instructionsId: Identifier }) {
    super();
    this.instructionsId = instructionsId;
  }

  override async execute({
    route,
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    if (route.pathname !== `/instructions/${this.instructionsId}`) {
      logger.debug(
        `current route isn't to the instructions ${this.instructionsId}, pushing`,
      );
      router.push(Hrefs.instructions({ "@id": this.instructionsId }));
    } else {
      logger.debug(
        `current route is already to the instructions ${this.instructionsId}, nop`,
      );
    }
  }

  override toString(): string {
    return `GiveInstructionsAction(instructionsId=${this.instructionsId})`;
  }
}
