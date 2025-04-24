import { Stack } from "expo-router";
import { DefaultReactNavigationThemeProvider } from "~/components/ReactNavigationThemeProvider";
import { screenOptions } from "~/components/screenOptions";

export default function QuestionLayout() {
  return (
    <DefaultReactNavigationThemeProvider>
      <Stack screenOptions={{ ...screenOptions }} />
    </DefaultReactNavigationThemeProvider>
  );
}
