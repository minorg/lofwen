import { Timestamp } from "@lofwen/models";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { InstructionsView } from "~/components/InstructionsView";
import { useEventLog } from "~/hooks/useEventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("InstructionsScreen");

export default function InstructionsScreen() {
  logger.debug("rendering");

  const { instructionsId } = useLocalSearchParams<{
    instructionsId: string;
  }>();
  const eventLog = useEventLog();

  const navigation = useNavigation();

  const nextAction = useMemo(() => workflow({ eventLog }), [eventLog]);

  const instructions = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (
        event["@type"] === "FormulatedInstructionsEvent" &&
        event.instructions["@id"] === instructionsId
      ) {
        logger.debug(`have instructions ${instructionsId} in event log`);
        return event.instructions;
      }
    }
    logger.debug(`no instructions ${instructionsId} in event log`);
    return null;
  }, [eventLog, instructionsId]);

  const onAcknowledge = useCallback(() => {
    invariant(instructions !== null);
    eventLog.append({
      instructionsId: instructions?.["@id"],
      timestamp: Timestamp.now(),
      "@type": "AcknowledgedInstructionsEvent",
    });
  }, [eventLog, instructions]);

  useEffect(() => {
    if (instructions !== null) {
      navigation.setOptions({
        headerTitle: instructions.title,
      });
    }
  }, [navigation, instructions]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: run useEffect once
  useEffect(() => {
    if (instructions !== null) {
      eventLog.append({
        "@type": "GaveInstructionsEvent",
        instructionsId: instructions["@id"],
        timestamp: Timestamp.now(),
      });
    }
  }, []);

  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);

  if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  }
  invariant(nextAction instanceof ExecutableAction);

  if (instructions === null) {
    logger.warn(`no such instructions: ${instructionsId}`);
    return <Redirect href={Hrefs.root} />;
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="web:px-4">
        <InstructionsView
          instructions={instructions}
          onAcknowledge={onAcknowledge}
        />
      </View>
    </SafeAreaView>
  );
}
