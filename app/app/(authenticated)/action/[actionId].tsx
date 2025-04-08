import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { type ReactElement, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { AcknowledgmentActionView } from "~/components/AcknowledgmentActionView";
import { LikertScaleQuestionActionView } from "~/components/LikertScaleQuestionActionView";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import type { Event } from "~/models";

export default function ActionScreen() {
  const { actionId } = useLocalSearchParams<{
    actionId: string;
  }>();
  const addLogEntry = useAddLogEntry();
  const log = useLog();
  const action = log.actionById(actionId);
  const navigation = useNavigation();
  const router = useRouter();
  const workflow = useWorkflow();

  const onEvent = useCallback(
    (event: Event) => {
      addLogEntry(event);

      logger.debug("invoking workflow");
      // log from the hook doesn't include the just-added event yet
      // Instead of looping back around to look for the event, temporarily concatenate it to the log for the benefit of the workflow.
      const nextAction = workflow({ event, log: log.concat(event) });

      addLogEntry(nextAction);

      const nextActionHref = Hrefs.action(nextAction);
      logger.debug("redirecting to", JSON.stringify(nextActionHref));
      router.push(nextActionHref);
    },
    [addLogEntry, log, router, workflow],
  );

  useEffect(() => {
    if (action) {
      navigation.setOptions({
        headerShown: !!action.label,
        title: action.label,
      });
    }
  }, [action, navigation]);

  if (!action) {
    logger.warn("no such action:", actionId);
    return <Redirect href={Hrefs.root} />;
  }

  let actionView: ReactElement;
  switch (action["@type"]) {
    case "AcknowledgmentAction":
      actionView = (
        <AcknowledgmentActionView action={action} onEvent={onEvent} />
      );
      break;
    case "LikertScaleQuestionAction":
      actionView = (
        <LikertScaleQuestionActionView action={action} onEvent={onEvent} />
      );
      break;
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      {actionView}
    </SafeAreaView>
  );
}
