import { ImageBackground, View } from "react-native";
import { IconView } from "~/components/IconView";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import type { Garden } from "~/models/Garden";
import type { GardenItem } from "~/models/GardenItem";

function GardenItemView({ gardenItem }: { gardenItem: GardenItem }) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="border-2 border-primary flex flex-row gap-4 p-4 rounded-sm">
      <View className="flex flex-col justify-center">
        <IconView
          color={isDarkColorScheme ? "white" : undefined}
          icon={gardenItem.icon}
          size={64}
        />
      </View>
      <View className="flex flex-col flex-1 items-end">
        <Text className="text-lg font-bold text-primary">
          {gardenItem.title}
        </Text>
        <Text className="text-secondary">{gardenItem.text}</Text>
      </View>
    </View>
  );
}

export function GardenView({ garden }: { garden: Garden }) {
  return (
    <View className="flex flex-col flex-1">
      <ImageBackground
        className="flex-1"
        imageClassName="opacity-10"
        source={require("../assets/images/morris-african-marigold.jpg")}
      >
        <View className="flex flex-col flex-1 gap-2 opacity-100 native:p-4">
          {garden.items.map((item) => (
            <GardenItemView gardenItem={item} key={item["@id"]} />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}
