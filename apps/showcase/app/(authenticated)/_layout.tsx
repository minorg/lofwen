import "~/global.css";
import { type AuthenticatedUser, useUser } from "@lofwen/auth";
import {
  TinyBaseEventLog,
  useTinyBaseEventLogSynchronizer,
} from "@lofwen/event-log";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
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
  const { startedSync } = useTinyBaseEventLogSynchronizer({
    logger,
    store,
    webSocketUrl: `${serverUrl}${user["@id"]}`,
  });

  if (!startedSync) {
    logger.debug("synchronizer hasn't started sync, not rendering");
    return null;
  }

  logger.debug("synchronized has started sync, rendering");
  return <>{children}</>;
}

export default function AuthenticatedLayout() {
  const store = useMemo(() => TinyBaseEventLog.Store.create(), []);
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
