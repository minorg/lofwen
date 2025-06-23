import { ThemeToggle } from "~/components/ThemeToggle";

export const screenOptions = {
  // ...(Platform.OS !== "ios"
  //   ? {}
  //   : {
  //       headerBlurEffect: "systemChromeMaterial" as const,
  //       headerLargeStyle: {
  //         // NEW: Make the large title transparent to match the background.
  //         backgroundColor: "transparent",
  //       },
  //       headerLargeTitle: true,
  //       headerLargeTitleShadowVisible: false,
  //       headerShadowVisible: true,
  //       headerTransparent: true,
  //     }),
  headerRight: () => <ThemeToggle />,
  headerTitle: "",
};
