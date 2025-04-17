import { useState } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { TinyBaseEventLog } from "./TinyBaseEventLog";

// // https://github.com/partykit/partykit/issues/516
// if (__DEV__) {
//   const Shim = require("event-target-shim");
//   globalThis.Event = Shim.Event;
//   globalThis.EventTarget = Shim.EventTarget;
// } else {
//   require("event-target-polyfill");
// }
// import { WebSocket } from "partysocket";

export function useTinyBaseEventLogSynchronizer({
  logger,
  store,
  webSocketUrl,
}: {
  logger: { debug: (...args: unknown[]) => void };
  store: TinyBaseEventLog.Store;
  webSocketUrl: string;
}) {
  const { useCreateSynchronizer } = TinyBaseEventLog.UiReact;
  const [startedSync, setStartedSync] = useState(false);
  const synchronizer = useCreateSynchronizer(
    store!,
    async (store: TinyBaseEventLog.Store) => {
      logger.debug("synchronizing with", webSocketUrl);

      const synchronizer = await createWsSynchronizer(
        store,
        new WebSocket(webSocketUrl),
      );

      synchronizer.addStatusListener((_, status) => {
        let statusString: string;
        switch (status) {
          case 0:
            statusString = "idle";
            break;
          case 1:
            statusString = "loading";
            break;
          case 2:
            statusString = "saving";
            break;
          default:
            statusString = "unknown";
            break;
        }
        logger.debug(`synchronization status: ${statusString}`);
      });

      await synchronizer.startSync();

      logger.debug("started sync with", webSocketUrl);
      setStartedSync(true);

      // If the websocket reconnects in the future, do another explicit sync.
      synchronizer.getWebSocket().addEventListener("open", () => {
        synchronizer.load().then(() => synchronizer.save());
      });

      return synchronizer;
    },
  );

  return { synchronizer, startedSync };
}
