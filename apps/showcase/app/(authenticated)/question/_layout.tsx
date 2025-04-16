import { Stack } from "expo-router";
import { screenOptions } from "~/screenOptions";

export default function QuestionLayout() {
  return <Stack screenOptions={{ ...screenOptions }} />;
}
