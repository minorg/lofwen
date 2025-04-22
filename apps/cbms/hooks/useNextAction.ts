import { usePathname, useRouter } from "expo-router";
import { useCallback } from "react";
import { useEventLog } from "~/hooks/useEventLog";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("useNextAction");

export function useNextAction() {
  const eventLog = useEventLog();
  const pathname = usePathname();
  const router = useRouter();

  const executeNextAction = useCallback(() => {
    logger.debug(
      `invoking workflow with last event type=${eventLog.last?.["@type"]}`,
    );
    const nextAction = workflow({ eventLog });
    logger.debug(
      `executing next action ${nextAction} with pathname=${pathname}`,
    );
    nextAction.execute({ eventLog, route: { pathname }, router });
  }, [eventLog, pathname, router]);

  return executeNextAction;
}
