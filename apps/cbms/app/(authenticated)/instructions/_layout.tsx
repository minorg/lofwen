import { Stack } from "expo-router";
import { screenOptions } from "~/components/screenOptions";

export default function InstructionsLayout() {
  return <Stack screenOptions={{ ...screenOptions }} />;
}
