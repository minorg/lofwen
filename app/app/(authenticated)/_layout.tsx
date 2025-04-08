import "~/global.css";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { type PropsWithChildren, useMemo, useState } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { useUser } from "~/hooks/useUser";
import { logger } from "~/logger";
import type { AuthenticatedUser } from "~/models";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

function Synchronization({
  children,
  serverUrl,
  store,
  user,
}: PropsWithChildren<{
  serverUrl: string;
  store: SynchronizedStore;
  user: AuthenticatedUser;
}>) {
  const { useCreateSynchronizer } = SynchronizedStore.UiReact;
  const [synchronizerStartedSync, setSynchronizerStartedSync] = useState(false);
  useCreateSynchronizer(store!, async (store: SynchronizedStore) => {
    const webSocketUrl = `${serverUrl}${user["@id"]}`;
    logger.info("synchronizing with", webSocketUrl);

    const synchronizer = await createWsSynchronizer(
      store,
      // new ReconnectingWebSocket(webSocketUrl, [], {
      //   maxReconnectionDelay: 1000,
      //   connectionTimeout: 1000,
      // }),
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
  const store = useMemo(() => SynchronizedStore.create(), []);
  const user = useUser();

  if (user["@type"] === "UnauthenticatedUser") {
    return <Redirect href={Hrefs.signIn} />;
  }

  const stack = <Stack screenOptions={{ headerShown: false }} />;

  return (
    <SynchronizedStore.UiReact.Provider store={store}>
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
    </SynchronizedStore.UiReact.Provider>
  );
}
