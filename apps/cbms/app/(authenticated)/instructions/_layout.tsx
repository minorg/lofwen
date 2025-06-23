import { Stack } from "expo-router";
import { screenOptions } from "~/components/screenOptions";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("InstructionsLayout");

export default function InstructionsLayout() {
  logger.debug("rendering");

  return <Stack screenOptions={{ ...screenOptions }} />;
}
