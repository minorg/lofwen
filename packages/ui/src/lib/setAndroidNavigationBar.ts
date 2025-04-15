import type { Theme } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar({
  navTheme,
  theme,
}: {
  navTheme: { dark: Theme; light: Theme };
  theme: "light" | "dark";
}) {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
  await NavigationBar.setBackgroundColorAsync(
    theme === "dark"
      ? navTheme.dark.colors.background
      : navTheme.light.colors.background,
  );
}
