import { useTheme } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
}) {
  if (Platform.OS !== "android") return;

  const { colors } = useTheme();

  await NavigationBar.setButtonStyleAsync(
    colorScheme === "dark" ? "light" : "dark",
  );
  await NavigationBar.setBackgroundColorAsync(colors.background);
}
