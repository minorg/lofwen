import { Redirect } from "expo-router";
import { useEffect } from "react";
import { invariant } from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { useActionHistory } from "~/hooks/useActionHistory";
import { useAddAction } from "~/hooks/useAddAction";
import { useAddEvent } from "~/hooks/useAddEvent";
import { useEventHistory } from "~/hooks/useEventHistory";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import { type Event, Identifier, Timestamp } from "~/models";

export default function RootScreen() {
  const addAction = useAddAction();
  const addEvent = useAddEvent();
  const actionHistory = useActionHistory();
  const eventHistory = useEventHistory();
  const workflow = useWorkflow();

  useEffect(() => {
    if (actionHistory.length > 0) {
      logger.debug(
        "there are already",
        actionHistory.length,
        "actions in the history",
      );
      return;
    }
    invariant(eventHistory.length === 0);

    const initialEvent: Event = {
      identifier: Identifier.random(),
      timestamp: Timestamp.now(),
      type: "InitialEvent",
    };
    logger.debug("adding initial event");
    addEvent(initialEvent);

    const initialAction = workflow({
      event: {
        identifier: Identifier.random(),
        timestamp: Timestamp.now(),
        type: "InitialEvent",
      },
      history: {
        actions: actionHistory,
      },
    });
    logger.debug("adding initial action");
    addAction(initialAction);
  }, [actionHistory, addAction, addEvent, eventHistory, workflow]);

  if (actionHistory.length === 0) {
    logger.debug("action history is empty");
    return null;
  }

  const lastAction = actionHistory[actionHistory.length - 1]!;
  logger.debug(`redirecting to last action: ${lastAction.identifier}`);

  return <Redirect href={Hrefs.action(lastAction) as any} />;
}
