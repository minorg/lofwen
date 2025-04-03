import { Redirect } from "expo-router";
import { useEffect } from "react";
import { invariant } from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { useStore } from "~/hooks/useStore";
import { useWorkflow } from "~/hooks/useWorkflow";
import { type Event, Identifier, Timestamp } from "~/models";

export default function RootScreen() {
  const store = useStore();
  const workflow = useWorkflow();

  useEffect(() => {
    if (store.actions.length > 0) {
      return;
    }
    invariant(store.events.length === 0);

    const initialEvent: Event = {
      identifier: Identifier.random(),
      timestamp: Timestamp.now(),
      type: "InitialEvent",
    };
    store.addEvent(initialEvent);

    const initialAction = workflow({
      event: {
        identifier: Identifier.random(),
        timestamp: Timestamp.now(),
        type: "InitialEvent",
      },
      history: store,
    });
    store.addAction(initialAction);
  }, [store, workflow]);

  const actions = store.actions;

  if (actions.length === 0) {
    return null;
  }

  return <Redirect href={Hrefs.action(actions[actions.length - 1]!) as any} />;
}
