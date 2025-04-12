import { Stack } from "expo-router";
import { screenOptions } from "~/constants/screenOptions";

export default function ActionLayout() {
  return <Stack screenOptions={{ ...screenOptions }} />;
}
