import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { useLog } from "~/hooks/useLog";

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
    return null;
  }

  return (
    <SafeAreaView>
      <Text>{action.identifier}</Text>
    </SafeAreaView>
  );
}
