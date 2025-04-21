import { Timestamp } from "@lofwen/models";
import { useEffect, useMemo } from "react";
import invariant from "ts-invariant";
import { useEventLog } from "~/hooks/useEventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  const eventLog = useEventLog();
  const nextAction = useMemo(() => workflow({ eventLog }), [eventLog]);
  logger.debug(`next action: ${nextAction}`);
  // biome-ignore lint/correctness/useExhaustiveDependencies: run useEffect once
  useEffect(() => {
    eventLog.append({ "@type": "StartedAppEvent", timestamp: Timestamp.now() });
  }, []);
  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);
  if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  }
  invariant(nextAction instanceof ExecutableAction);
  return null;
}
