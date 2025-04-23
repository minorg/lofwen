import { Pressable, View } from "react-native";
import { IconView } from "~/components/IconView";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import type { GardenItem } from "~/models/GardenItem";

export function GardenItemView({
  gardenItem,
  onSelect,
}: { gardenItem: GardenItem; onSelect: () => void }) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="border-2 border-primary flex flex-row gap-4 p-4 rounded-sm">
      <View className="flex flex-col justify-center">
        <Pressable onPress={onSelect}>
          <IconView
            color={isDarkColorScheme ? "white" : undefined}
            icon={gardenItem.icon}
            size={64}
          />
        </Pressable>
      </View>
      <View className="flex flex-col flex-1 items-end">
        <Button onPress={onSelect} variant="outline">
          <Text className="text-lg font-bold">{gardenItem.title}</Text>
        </Button>
        <Text className="text-secondary">{gardenItem.text}</Text>
      </View>
    </View>
  );
}
