import { View } from "react-native";
import {} from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import type { AcknowledgmentAction, Event } from "~/models";

export function AcknowledgmentActionView({
  action,
}: {
  action: AcknowledgmentAction;
  onEvent: (event: Event) => void;
}) {
  return (
    <View className="flex flex-col flex-1 native:justify-center native:px-4">
      <Text className="text-2xl">{action.message}</Text>
    </View>
  );
}
