import { Redirect } from "expo-router";
import { useEffect } from "react";
import { invariant } from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { useStore } from "~/hooks/useStore";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import { type Event, Identifier, Timestamp } from "~/models";

export default function RootScreen() {
  const store = useStore();
  const workflow = useWorkflow();

  useEffect(() => {
    if (store.actions.length > 0) {
      logger.debug("store actions is not empty");
      return;
    }
    invariant(store.events.length === 0);

    const initialEvent: Event = {
      identifier: Identifier.random(),
      timestamp: Timestamp.now(),
      type: "InitialEvent",
    };
    logger.debug("adding initial event to store");
    store.addEvent(initialEvent);

    const initialAction = workflow({
      event: {
        identifier: Identifier.random(),
        timestamp: Timestamp.now(),
        type: "InitialEvent",
      },
      history: store,
    });
    logger.debug("adding initial action to store");
    store.addAction(initialAction);
  }, [store, workflow]);

  const actions = store.actions;

  if (actions.length === 0) {
    logger.debug("actions is empty");
    return null;
  }

  const lastAction = actions[actions.length - 1]!;
  logger.debug(`redirecting to last action: ${lastAction.identifier}`);

  return <Redirect href={Hrefs.action(lastAction) as any} />;
}
