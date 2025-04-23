import { Timestamp } from "@lofwen/models";
import {
  Redirect,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import invariant from "ts-invariant";
import { Hrefs } from "~/Hrefs";
import { InstructionsView } from "~/components/InstructionsView";
import { useEventLog } from "~/hooks/useEventLog";
import { useNextAction } from "~/hooks/useNextAction";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("InstructionsScreen");

export default function InstructionsScreen() {
  const { instructionsId } = useLocalSearchParams<{
    instructionsId: string;
  }>();
  logger.debug(`rendering: instructionsId=${instructionsId}`);
  const eventLog = useEventLog();

  const navigation = useNavigation();

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

  useFocusEffect(useNextAction());

  if (instructions === null) {
    logger.warn(`no such instructions: ${instructionsId}`);
    return <Redirect href={Hrefs.root} />;
  }

  return (
    <InstructionsView
      instructions={instructions}
      onAcknowledge={onAcknowledge}
    />
  );
}
