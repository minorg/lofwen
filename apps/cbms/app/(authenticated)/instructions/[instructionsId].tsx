import { Timestamp } from "@lofwen/models";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import invariant from "ts-invariant";
import { InstructionsView } from "~/components/InstructionsView";
import { useEventLog } from "~/hooks/useEventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import { GiveInstructionsAction } from "~/models/GiveInstructionsAction";
import { NopAction } from "~/models/NopAction";
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
        event["@type"] === "GaveInstructionsEvent" &&
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

  useEffect(() => {
    const lastEvent = eventLog.last;
    // The workflow should return the GiveInstructionsAction until the redirect here succeeds and the GaveInstructionsEvent is added to the event log
    if (
      nextAction instanceof GiveInstructionsAction &&
      nextAction.instructions["@id"] === instructionsId
    ) {
      if (
        lastEvent === null ||
        lastEvent["@type"] !== "GaveInstructionsEvent" ||
        lastEvent.instructions["@id"] !== instructionsId
      ) {
        logger.debug(
          `last event is not a GaveInstructionsEvent to the current instructions (${instructionsId}), appending a GaveInstructionsEvent to the event log`,
        );
        eventLog.append({
          "@type": "GaveInstructionsEvent",
          instructions: nextAction.instructions,
          timestamp: Timestamp.now(),
        });
      } else {
        logger.debug(
          `last event is already a GaveInstructionsEvent to the current instructions (${instructionsId})`,
        );
      }
    }
  }, [eventLog, nextAction, instructionsId]);

  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);

  if (nextAction instanceof NopAction) {
    logger.debug("next action is nop");
  } else if (nextAction instanceof GiveInstructionsAction) {
    if (nextAction.instructions["@id"] === instructionsId) {
      logger.debug("next action would execute to the current page, nop");
    } else {
      return nextAction.render();
    }
  } else if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  } else {
    invariant(nextAction instanceof ExecutableAction);
  }

  if (instructions === null) {
    logger.debug("instructions not set yet");
    return null;
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
