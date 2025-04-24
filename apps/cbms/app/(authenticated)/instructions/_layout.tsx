import { Stack } from "expo-router";
import { DefaultReactNavigationThemeProvider } from "~/components/ReactNavigationThemeProvider";
import { screenOptions } from "~/components/screenOptions";

export default function InstructionsLayout() {
  return (
    <DefaultReactNavigationThemeProvider>
      <Stack screenOptions={{ ...screenOptions }} />
    </DefaultReactNavigationThemeProvider>
  );
}
