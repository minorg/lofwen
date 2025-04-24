import { Hrefs } from "~/Hrefs";
import { Action } from "~/models/Action";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("OpenChatAction");

export class OpenChatAction extends Action {
  static readonly instance = new OpenChatAction();

  private constructor() {
    super();
  }

  override async execute({
    route,
    router,
  }: Parameters<Action["execute"]>[0]): Promise<void> {
    if (route.pathname !== "/chat") {
      logger.debug("current route isn't to the chat, pushing");
      router.push(Hrefs.chat);
    } else {
      logger.debug("current route is already to the chat, nop");
    }
  }
  override toString(): string {
    return "OpenChatAction()";
  }
}
