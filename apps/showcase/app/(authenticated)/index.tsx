import { useEffect } from "react";

import { Timestamp } from "@lofwen/models";
import { useEventLog } from "~/hooks/useEventLog";
import { useWorkflowEngine } from "~/hooks/useWorkflowEngine";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  const lastEvent = useEventLog().last;
  const workflowEngine = useWorkflowEngine();

  useEffect(() => {
    if (lastEvent !== null) {
      logger.debug("there are already actions in the log");
      return;
    }

    workflowEngine.onEvent({
      "@type": "AppStartedEvent",
      timestamp: Timestamp.now(),
    }); // Will redirect
  }, [lastEvent, workflowEngine]);
}
