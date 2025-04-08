import { useClerk } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { secureStoreKeys } from "~/constants/secureStoreKeys";
import { logger } from "~/logger";

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
      if (Platform.OS === "web") {
        localStorage.removeItem(secureStoreKeys.localUserId);
      } else {
        await SecureStore.deleteItemAsync(secureStoreKeys.localUserId);
      }
    })();
  }, []);

  return <Redirect href={Hrefs.signIn} />;
}
