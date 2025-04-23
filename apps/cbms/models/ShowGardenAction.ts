import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("ShowGardenAction");

/**
 * Redirect to the garden page.
 *
 * Assumes a Garden has already been added to the event log as a FormulatedGardenEvent by FormulateGardenAction.
 *
 * See notes in FormulateGardenAction re: the action-event sequence.
 */
export class ShowGardenAction extends Action {
  static readonly instance = new ShowGardenAction();

  private constructor() {
    super();
  }

  override async execute({
    route,
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    if (route.pathname !== "/garden") {
      logger.debug("current route isn't to the garden, pushing");
      router.push(Hrefs.garden);
    } else {
      logger.debug("current route is already to the garden, nop");
    }
  }

  override toString(): string {
    return "ShowGardenAction()";
  }
}
