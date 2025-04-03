import { Redirect } from "expo-router";
import { useMemo } from "react";
import { Hrefs } from "~/Hrefs";
import { useHistory } from "~/hooks/useHistory";
import { useWorkflow } from "~/hooks/useWorkflow";
import { Identifier, Timestamp } from "~/models";

export default function RootScreen() {
  const history = useHistory();
  const workflow = useWorkflow();

  const initialAction = useMemo(
    () =>
      workflow({
        event: {
          identifier: Identifier.random(),
          timestamp: Timestamp.now(),
          type: "InitialEvent",
        },
        history,
      }),
    [history, workflow],
  );

  return <Redirect href={Hrefs.action(initialAction) as any} />;
}
