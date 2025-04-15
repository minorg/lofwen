import type { Theme } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar({
  colorScheme,
  navTheme,
}: {
  colorScheme: "light" | "dark";
  navTheme: { dark: Theme; light: Theme };
}) {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(
    colorScheme === "dark" ? "light" : "dark",
  );
  await NavigationBar.setBackgroundColorAsync(
    colorScheme === "dark"
      ? navTheme.dark.colors.background
      : navTheme.light.colors.background,
  );
}
