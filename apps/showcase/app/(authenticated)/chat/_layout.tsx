import { Stack } from "expo-router";
import { screenOptions } from "~/screenOptions";

export default function ChatLayout() {
  return <Stack screenOptions={{ ...screenOptions, headerTitle: "Chat" }} />;
}
