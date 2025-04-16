import "~/global.css";
import { type AuthenticatedUser, useUser } from "@lofwen/auth";
import { TinyBaseEventLog } from "@lofwen/event-log";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
// // https://github.com/partykit/partykit/issues/516
// if (__DEV__) {
//   const Shim = require("event-target-shim");
//   globalThis.Event = Shim.Event;
//   globalThis.EventTarget = Shim.EventTarget;
// } else {
//   require("event-target-polyfill");
// }
// import { WebSocket } from "partysocket";
import { type PropsWithChildren, useMemo, useState } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { createMergeableStore } from "tinybase/with-schemas";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("Synchronizer");

function Synchronization({
  children,
  serverUrl,
  store,
  user,
}: PropsWithChildren<{
  serverUrl: string;
  store: TinyBaseEventLog.Store;
  user: AuthenticatedUser;
}>) {
  const { useCreateSynchronizer } = TinyBaseEventLog.UiReact;
  const [synchronizerStartedSync, setSynchronizerStartedSync] = useState(false);
  useCreateSynchronizer(store!, async (store: TinyBaseEventLog.Store) => {
    const webSocketUrl = `${serverUrl}${user["@id"]}`;
    logger.info("synchronizing with", webSocketUrl);

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

    logger.info("started sync with", webSocketUrl);
    setSynchronizerStartedSync(true);

    // If the websocket reconnects in the future, do another explicit sync.
    synchronizer.getWebSocket().addEventListener("open", () => {
      synchronizer.load().then(() => synchronizer.save());
    });

    return synchronizer;
  });

  if (!synchronizerStartedSync) {
    logger.debug("synchronizer hasn't started sync, not rendering");
    return null;
  }
  logger.debug("synchronized has started sync, rendering");
  return <>{children}</>;
}

export default function AuthenticatedLayout() {
  const store = useMemo(
    () => createMergeableStore().setTablesSchema(TinyBaseEventLog.tablesSchema),
    [],
  );
  const user = useUser({ configuration, logger });

  if (user["@type"] === "UnauthenticatedUser") {
    return <Redirect href={Hrefs.signIn} />;
  }

  const stack = <Stack screenOptions={{ headerShown: false }} />;

  return (
    <TinyBaseEventLog.UiReact.Provider store={store}>
      {configuration.synchronization !== null ? (
        <Synchronization
          serverUrl={configuration.synchronization.serverUrl!}
          store={store}
          user={user}
        >
          {stack}
        </Synchronization>
      ) : (
        stack
      )}
    </TinyBaseEventLog.UiReact.Provider>
  );
}
