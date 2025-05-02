import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "~/components/IconView";
import { Markdown } from "~/components/Markdown";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { TableCell, TableRow } from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { useTheme } from "~/hooks/useTheme";
import type { GardenItem } from "~/models/GardenItem";

const COLUMN_WIDTH_PROPORTIONS = [1, 2];

export function GardenItemView({
  gardenItem,
  onSelect,
}: { gardenItem: GardenItem; onSelect: () => void }) {
  const { colors } = useTheme();

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const columnWidths = useMemo(() => {
    return COLUMN_WIDTH_PROPORTIONS.map((minWidth) => {
      const evenWidth =
        (width - (insets.right - insets.left)) /
        COLUMN_WIDTH_PROPORTIONS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [insets, width]);

  return (
    <TableRow>
      <TableCell style={{ width: columnWidths[0] }}>
        <Button className="flex flex-row items-center gap-2" onPress={onSelect}>
          <Text>{gardenItem.name}</Text>
          <IconView color={colors.text} icon={gardenItem.icon} size={24} />
        </Button>
      </TableCell>
      <TableCell style={{ width: columnWidths[1] }}>
        <Collapsible>
          <CollapsibleTrigger>
            <Text className="font-bold">
              {gardenItem.shortDescription}
              <MaterialCommunityIcons name="information-outline" size={16} />
            </Text>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Markdown>{gardenItem.description}</Markdown>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
}
