import { Image, View } from "react-native";
import images from "~/assets/images";
import { Markdown } from "~/components/Markdown";
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
    <View className="flex flex-col flex-1">
      {instructions.image ? (
        <Image
          source={images[instructions.image]}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      ) : null}
      {instructions.text ? <Markdown>{instructions.text}</Markdown> : null}
      <Button onPress={onAcknowledge} variant="outline">
        <Text>OK</Text>
      </Button>
    </View>
  );
}
