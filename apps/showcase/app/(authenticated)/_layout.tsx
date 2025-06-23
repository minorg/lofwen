import "~/global.css";
import type { AuthenticatedUser } from "@lofwen/auth";
import {
  TinyBaseEventLog,
  useTinyBaseEventLogSynchronizer,
} from "@lofwen/event-log";
import { Redirect, Slot } from "expo-router";
import type { PropsWithChildren } from "react";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { useUser } from "~/hooks/useUser";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("AuthenticatedLayout");

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
  const { useCreateStore } = TinyBaseEventLog.UiReact;
  const store = useCreateStore(() => TinyBaseEventLog.Store.create());
  const user = useUser();

  if (user["@type"] === "UnauthenticatedUser") {
    logger.debug("user is unauthenticated, redirecting to sign-in");
    return <Redirect href={Hrefs.signIn} />;
  }
  logger.debug(`user is authenticated: ${JSON.stringify(user)}`);

  const stack = <Slot screenOptions={{ headerShown: false }} />;

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
