import { Platform } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";

export const screenOptions = {
  ...(Platform.OS !== "ios"
    ? {}
    : {
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial" as const,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: true,
        headerLargeStyle: {
          // NEW: Make the large title transparent to match the background.
          backgroundColor: "transparent",
        },
      }),
  headerRight: () => <ThemeToggle />,
  headerTitle: "",
};
