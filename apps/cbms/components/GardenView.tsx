import { View } from "react-native";
import Markdown from "react-native-markdown-display";
import { IconView } from "~/components/IconView";
import { Text } from "~/components/ui/text";
import type { Garden } from "~/models/Garden";
import type { GardenItem } from "~/models/GardenItem";

function GardenItemView({ gardenItem }: { gardenItem: GardenItem }) {
  return (
    <View className="border-4 border-primary flex flex-row p-2 native:justify-center">
      <View className="items-center justify-start">
        <IconView icon={gardenItem.icon} size={64} />
      </View>
      <View className="flex flex-col flex-1 items-end">
        <Text className="text-xl font-bold">{gardenItem.title}</Text>
        <Text className="text-lg">
          <Markdown>{gardenItem.text}</Markdown>
        </Text>
      </View>
    </View>
  );
}

export function GardenView({ garden }: { garden: Garden }) {
  return (
    <View className="flex flex-col flex-1 gap-2 native:px-4 native:py-2">
      {garden.items.map((item) => (
        <GardenItemView gardenItem={item} key={item["@id"]} />
      ))}
    </View>
  );
}
