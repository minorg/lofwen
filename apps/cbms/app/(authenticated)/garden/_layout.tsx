import { Stack } from "expo-router";
import { screenOptions } from "~/components/screenOptions";

export default function GardenLayout() {
  return <Stack screenOptions={{ ...screenOptions, headerTitle: "Garden" }} />;
}
