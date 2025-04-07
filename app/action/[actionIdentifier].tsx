import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { type ReactElement, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { LikertScaleQuestionActionView } from "~/components/LikertScaleQuestionActionView";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { useWorkflow } from "~/hooks/useWorkflow";
import { logger } from "~/logger";
import type { Event } from "~/models";

export default function ActionScreen() {
  const { actionIdentifier } = useLocalSearchParams<{
    actionIdentifier: string;
  }>();
  const addLogEntry = useAddLogEntry();
  const log = useLog();
  const action = log.actionByIdentifier(actionIdentifier);
  const navigation = useNavigation();
  const router = useRouter();
  const workflow = useWorkflow();

  const onEvent = useCallback(
    (event: Event) => {
      logger.debug("adding log entry:", JSON.stringify(event));
      addLogEntry(event);

      logger.debug("invoking workflow");
      const nextAction = workflow({ event, log });

      addLogEntry(nextAction);
      logger.debug("adding log entry:", JSON.stringify(nextAction));

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
    logger.warn("no such action:", actionIdentifier);
    return <Redirect href={Hrefs.root()} />;
  }

  let actionView: ReactElement;
  switch (action.actionType) {
    case "LikertScaleQuestionAction":
      actionView = (
        <LikertScaleQuestionActionView action={action} onEvent={onEvent} />
      );
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      {actionView}
    </SafeAreaView>
  );
}
