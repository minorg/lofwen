import { Slot } from "expo-router";
import { screenOptions } from "~/screenOptions";

export default function ChatLayout() {
  return <Slot screenOptions={{ ...screenOptions, headerTitle: "Chat" }} />;
}
