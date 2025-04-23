import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import type { OpaqueColorValue } from "react-native";
import type { Icon } from "~/models/Icon";

export function IconView({
  icon,
  ...props
}: { color?: string | OpaqueColorValue; icon: Icon; size?: number }) {
  switch (icon.family) {
    case "FontAwesome6":
      return <FontAwesome6 name={icon.name} {...props} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={icon.name} {...props} />;
    case "MaterialIcons":
      return <MaterialIcons name={icon.name} {...props} />;
  }
}
