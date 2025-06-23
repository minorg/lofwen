import { useFocusEffect } from "expo-router";
import { useNextAction } from "~/hooks/useNextAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  logger.debug("rendering");
  useFocusEffect(useNextAction());
  return null;
}
