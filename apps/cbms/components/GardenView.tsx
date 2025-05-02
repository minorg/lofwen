import { ImageBackground } from "react-native";
import { GardenItemView } from "~/components/GardenItemView";
import { Table } from "~/components/ui/table";
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
      <Table className="opacity-100">
        {garden.items.map((item) => (
          <GardenItemView
            gardenItem={item}
            key={item["@id"]}
            onSelect={() => onSelectItem(item)}
          />
        ))}
      </Table>
    </ImageBackground>
  );
}
