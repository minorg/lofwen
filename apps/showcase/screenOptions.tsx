import { ThemeToggle } from "@lofwen/ui";
import { Platform } from "react-native";
import { navTheme } from "~/navTheme";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("ThemeToggle");

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
  headerRight: () => <ThemeToggle logger={logger} navTheme={navTheme} />,
  headerTitle: "",
};
