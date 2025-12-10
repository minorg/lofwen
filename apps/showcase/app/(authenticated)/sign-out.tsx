import { useClerk } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";

import { rootLogger } from "~/rootLogger";
import { localUserStore } from "~/stores/localUserStore";

const logger = rootLogger.extend("SignOutScreen");

export default function SignOutScreen() {
  const {
    loaded: clerkLoaded,
    signOut: clerkSignOut,
    user: clerkUser,
  } = configuration.clerk
    ? useClerk()
    : { loaded: false, signOut: () => {}, user: null };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      if (clerkUser) {
        logger.debug("Clerk user signed in, signing out");
        await clerkSignOut();
        return;
      }

      if (clerkLoaded) {
        logger.debug("Clerk is loaded but no Clerk user is signed in");
      }

      logger.debug("removing local user from secure store");
      await localUserStore.clearLocalUserAsync();
    })();
  }, []);

  return <Redirect href={Hrefs.signIn} />;
}
