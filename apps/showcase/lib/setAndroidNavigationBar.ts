import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { navTheme } from "~/navTheme";

export async function setAndroidNavigationBar({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
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
