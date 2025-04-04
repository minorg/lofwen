import { useLocalSearchParams, useNavigation } from "expo-router";
import { type ReactElement, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuestionActionView } from "~/components/QuestionActionView";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";

export default function ActionScreen() {
  const { actionIdentifier } = useLocalSearchParams<{
    actionIdentifier: string;
  }>();
  const log = useLog();
  const action = log.actionByIdentifier(actionIdentifier);
  const navigation = useNavigation();
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
      actionView = <QuestionActionView questionAction={action} />;
  }

  return <SafeAreaView>{actionView}</SafeAreaView>;
}
