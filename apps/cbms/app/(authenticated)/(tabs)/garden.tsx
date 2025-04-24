import { Timestamp } from "@lofwen/models";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Hrefs } from "~/Hrefs";
import { GardenView } from "~/components/GardenView";
import { useEventLog } from "~/hooks/useEventLog";
import { useNextAction } from "~/hooks/useNextAction";
import type { GardenItem } from "~/models/GardenItem";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("GardenScreen");

export default function GardenScreen() {
  logger.debug("rendering");

  const eventLog = useEventLog();

  const garden = useMemo(() => {
    for (const event of eventLog.reverse()) {
      if (event["@type"] === "FormulatedGardenEvent") {
        logger.debug("have garden in event log");
        return event.garden;
      }
    }
    logger.warn("no garden in event log");
    return null;
  }, [eventLog]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run useEffect once
  useEffect(() => {
    if (garden !== null) {
      eventLog.append({
        "@type": "ShowedGardenEvent",
        timestamp: Timestamp.now(),
      });
    }
  }, []);

  useFocusEffect(useNextAction());

  const onSelectItem = useCallback(
    (item: GardenItem) => {
      eventLog.append({
        "@type": "SelectedGardenItemEvent",
        gardenItem: item,
        timestamp: Timestamp.now(),
      });
    },
    [eventLog],
  );

  if (garden === null) {
    return <Redirect href={Hrefs.root} />;
  }

  return <GardenView garden={garden} onSelectItem={onSelectItem} />;
}
