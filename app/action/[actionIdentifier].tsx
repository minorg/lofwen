import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useStore } from "~/hooks/useStore";

export default function ActionScreen() {
  const { actionIdentifier } = useLocalSearchParams();
  const store = useStore();
  const action = store.actions.find(
    (action) => action.identifier === actionIdentifier,
  );
  if (!action) {
    return null;
  }

  return (
    <View>
      <Text>{action.identifier}</Text>
    </View>
  );
}
