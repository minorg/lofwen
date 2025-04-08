import "~/global.css";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { Fragment, useMemo } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { useUser } from "~/hooks/useUser";
import { logger } from "~/logger";
import type { AuthenticatedUser } from "~/models";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

function Synchronization({
  serverUrl,
  store,
  user,
}: { serverUrl: string; store: SynchronizedStore; user: AuthenticatedUser }) {
  const { useCreateSynchronizer } = SynchronizedStore.UiReact;
  useCreateSynchronizer(
    store!,
    async (store: SynchronizedStore) => {
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

      await synchronizer.startSync();

      // If the websocket reconnects in the future, do another explicit sync.
      synchronizer.getWebSocket().addEventListener("open", () => {
        synchronizer.load().then(() => synchronizer.save());
      });

      return synchronizer;
    },
    [],
  );

  return <Fragment />;
}

export default function AuthenticatedLayout() {
  const store = useMemo(() => SynchronizedStore.create(), []);
  const user = useUser();

  if (user["@type"] === "UnauthenticatedUser") {
    return <Redirect href={Hrefs.signIn} />;
  }

  return (
    <SynchronizedStore.UiReact.Provider store={store}>
      {configuration.synchronization !== null ? (
        <Synchronization
          serverUrl={configuration.synchronization.serverUrl!}
          store={store}
          user={user}
        />
      ) : null}
      <Stack screenOptions={{ headerShown: false }} />
    </SynchronizedStore.UiReact.Provider>
  );
}
