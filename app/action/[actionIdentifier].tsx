import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { type ReactElement, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { QuestionActionView } from "~/components/QuestionActionView";
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
      navigation.setOptions({ title: action.identifier });
    }
  }, [action, navigation]);

  if (!action) {
    logger.warn("no such action:", actionIdentifier);
    return null;
  }

  let actionView: ReactElement;
  switch (action.actionType) {
    case "QuestionAction":
      actionView = (
        <QuestionActionView onEvent={onEvent} questionAction={action} />
      );
  }

  return <SafeAreaView>{actionView}</SafeAreaView>;
}
