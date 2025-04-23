import {} from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import type { Instructions } from "~/models/Instructions";

export function InstructionsView({
  instructions,
  onAcknowledge,
}: {
  instructions: Instructions;
  onAcknowledge: () => void;
}) {
  return (
    <View className="flex flex-col flex-1 gap-2 native:p-4">
      <Text>{instructions.text}</Text>
      <Button onPress={onAcknowledge} variant="outline">
        <Text>OK</Text>
      </Button>
    </View>
  );
}
