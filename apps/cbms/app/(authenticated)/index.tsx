import { Timestamp } from "@lofwen/models";
import { useEffect, useMemo } from "react";
import invariant from "ts-invariant";
import { useEventLog } from "~/hooks/useEventLog";
import { NopAction } from "~/models/NopAction";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  const eventLog = useEventLog();
  const action = useMemo(() => workflow({ eventLog }), [eventLog]);
  logger.debug(`action: ${action}`);
  // biome-ignore lint/correctness/useExhaustiveDependencies: run useEffect once
  useEffect(() => {
    eventLog.append({ "@type": "StartedAppEvent", timestamp: Timestamp.now() });
  }, []);
  if (action instanceof NopAction) {
    return null;
  }
  invariant(action instanceof RenderableAction);
  return (action as RenderableAction).render();
}
