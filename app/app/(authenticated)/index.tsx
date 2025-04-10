import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Hrefs } from "~/Hrefs";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import { type Event, Timestamp } from "~/models";

export default function RootScreen() {
  const addLogEntry = useAddLogEntry();
  const log = useLog();
  const lastAction = log.lastActionEntry?.action ?? null;
  const workflow = useWorkflow();

  useEffect(() => {
    if (lastAction !== null) {
      logger.debug("there are already actions in the log");
      return;
    }

    const initialEvent: Event = {
      "@type": "InitialEvent",
    };
    addLogEntry({
      "@type": "EventLogEntry",
      event: initialEvent,
      timestamp: Timestamp.now(),
    });

    const initialAction = workflow({
      event: initialEvent,
      log,
    });
    addLogEntry({
      "@type": "ActionLogEntry",
      action: initialAction,
      timestamp: Timestamp.now(),
    });
  }, [addLogEntry, lastAction, log, workflow]);

  if (lastAction === null) {
    logger.debug("there is no last action");
    return null;
  }

  logger.debug(`redirecting to last action: ${lastAction["@id"]}`);

  return <Redirect href={Hrefs.action(lastAction)} />;
}
