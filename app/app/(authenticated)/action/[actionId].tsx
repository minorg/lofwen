import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { useLog } from "~/hooks/useLog";
import { useWorkflowEngine } from "~/hooks/useWorkflowEngine";
import { renderAction } from "~/lib/renderAction";
import { logger } from "~/logger";
import { Action, type Event } from "~/models";

export default function ActionScreen() {
  const { actionId } = useLocalSearchParams<{
    actionId: string;
  }>();
  const log = useLog();
  const action = log.actionById(actionId);
  const navigation = useNavigation();
  const router = useRouter();
  const workflowEngine = useWorkflowEngine();

  const onEvent = useCallback(
    (event: Event) => {
      const nextAction = await workflowEngine.onEvent(event);
      const nextActionHref = Hrefs.action(nextAction);
      logger.debug("redirecting to", JSON.stringify(nextActionHref));
      router.push(nextActionHref);
    },
    [router, workflowEngine],
  );

  useEffect(() => {
    if (action && Action.isRenderable(action)) {
      navigation.setOptions({
        headerTitle: action.title,
      });
    }
  }, [action, navigation]);

  if (!action) {
    logger.warn("no such action:", actionId);
    return <Redirect href={Hrefs.root} />;
  }

  if (!Action.isRenderable(action)) {
    logger.warn("action", actionId, "is not renderable");
    return <Redirect href={Hrefs.root} />;
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="web:px-4">{renderAction({ action, onEvent })}</View>
    </SafeAreaView>
  );
}
