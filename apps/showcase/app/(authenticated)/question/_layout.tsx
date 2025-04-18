import { Stack } from "expo-router";
import { screenOptions } from "~/components/screenOptions";

export default function QuestionLayout() {
  return <Stack screenOptions={{ ...screenOptions }} />;
}
