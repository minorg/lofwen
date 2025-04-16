import { useMemo } from "react";
import invariant from "ts-invariant";
import { useEventLog } from "~/hooks/useEventLog";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  const eventLog = useEventLog();
  const action = useMemo(() => workflow({ eventLog }), [eventLog]);
  logger.debug(`action: ${action}`);
  invariant(action instanceof RenderableAction);
  return (action as RenderableAction).render();
}
