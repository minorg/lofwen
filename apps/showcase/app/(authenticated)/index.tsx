import { useMemo } from "react";
import { executeAction } from "~/executeAction";
import { useEventLog } from "~/hooks/useEventLog";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  const eventLog = useEventLog();
  const action = useMemo(() => workflow({ eventLog }), [eventLog]);
  logger.debug("action:", action["@type"]);
  return executeAction({ action, eventLog });
}
