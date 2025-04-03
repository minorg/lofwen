import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { useStore } from "~/hooks/useStore";

export default function ActionScreen() {
  const { actionIdentifier } = useLocalSearchParams();
  const store = useStore();
  const action = useMemo(
    () =>
      store.actions.find((action) => action.identifier === actionIdentifier),
    [actionIdentifier, store],
  );
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
