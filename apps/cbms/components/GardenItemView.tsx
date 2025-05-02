import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { IconView } from "~/components/IconView";
import { Markdown } from "~/components/Markdown";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useTheme } from "~/hooks/useTheme";
import type { GardenItem } from "~/models/GardenItem";

export function GardenItemView({
  gardenItem,
  onSelect,
}: { gardenItem: GardenItem; onSelect: () => void }) {
  const { colors } = useTheme();
  const [showDescription, setShowDescription] = useState(false);

  return (
    <View className="border-2 border-secondary flex flex-col gap-2 p-4">
      <View className="flex flex-row gap-4 items-center">
        <Button
          className="flex flex-row gap-2 items-center justify-center min-w-[10rem]"
          onPress={onSelect}
        >
          <Text>{gardenItem.name}</Text>
          <IconView color={colors.text} icon={gardenItem.icon} size={24} />
        </Button>
        <Pressable
          className="flex flex-col flex-shrink"
          onPress={() => setShowDescription(!showDescription)}
        >
          <Text className="font-bold">
            {gardenItem.shortDescription}{" "}
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              className="text-foreground"
            />
          </Text>
        </Pressable>
      </View>
      {showDescription ? <Markdown>{gardenItem.description}</Markdown> : null}
    </View>
  );
}
