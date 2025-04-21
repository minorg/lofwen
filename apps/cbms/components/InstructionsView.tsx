import {} from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";
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
    <View className="flex flex-col flex-1 gap-2 native:justify-center native:px-4">
      <Text className="text-2xl">
        <Markdown>{instructions.text}</Markdown>
      </Text>
      <Button onPress={onAcknowledge} variant="outline">
        <Text>OK</Text>
      </Button>
    </View>
  );
}
