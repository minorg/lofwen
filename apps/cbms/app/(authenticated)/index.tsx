import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { useEventLog } from "~/hooks/useEventLog";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  const eventLog = useEventLog();
  const nextAction = useMemo(() => workflow({ eventLog }), [eventLog]);
  const router = useRouter();
  logger.debug(`next action: ${nextAction}`);
  useFocusEffect(
    useCallback(() => {
      nextAction.execute({ eventLog, router });
    }, [eventLog, nextAction, router]),
  );
  return null;
}
