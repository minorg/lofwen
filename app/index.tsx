import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Hrefs } from "~/Hrefs";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import { type Event, Identifier, Timestamp } from "~/models";

export default function RootScreen() {
  const addLogEntry = useAddLogEntry();
  const log = useLog();
  const lastAction = log.lastAction;
  const workflow = useWorkflow();

  useEffect(() => {
    if (lastAction !== null) {
      logger.debug("there are already actions in the log");
      return;
    }

    const initialEvent: Event = {
      eventType: "InitialEvent",
      identifier: Identifier.random(),
      logEntryType: "Event",
      timestamp: Timestamp.now(),
    };
    logger.debug("adding initial event");
    addLogEntry(initialEvent);

    const initialAction = workflow({
      event: initialEvent,
      log,
    });
    logger.debug("adding initial action");
    addLogEntry(initialAction);
  }, [addLogEntry, lastAction, log, workflow]);

  if (lastAction === null) {
    logger.debug("there is no last action");
    return null;
  }

  logger.debug(`redirecting to last action: ${lastAction.identifier}`);

  return <Redirect href={Hrefs.action(lastAction)} />;
}
