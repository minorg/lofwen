import { Stack } from "expo-router";
import { screenOptions } from "~/screenOptions";

export default function ActionLayout() {
  return <Stack screenOptions={{ ...screenOptions }} />;
}
