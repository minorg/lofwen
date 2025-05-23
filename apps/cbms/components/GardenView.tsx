import { ImageBackground, View } from "react-native";
import { GardenItemView } from "~/components/GardenItemView";
import type { Garden } from "~/models/Garden";
import type { GardenItem } from "~/models/GardenItem";

export function GardenView({
  garden,
  onSelectItem,
}: { garden: Garden; onSelectItem: (item: GardenItem) => void }) {
  return (
    <ImageBackground
      className="flex-1"
      imageClassName="opacity-10"
      source={require("../assets/images/morris-african-marigold.jpg")}
    >
      <View className="flex flex-col flex-1 gap-4 opacity-100 native:p-4">
        {garden.items.map((item) => (
          <GardenItemView
            gardenItem={item}
            key={item["@id"]}
            onSelect={() => onSelectItem(item)}
          />
        ))}
      </View>
    </ImageBackground>
  );
}
