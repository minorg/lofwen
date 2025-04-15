import { useUser as useClerkUser } from "@clerk/clerk-expo";
import * as reactNativeLogs from "react-native-logs";
import type { User } from "./User";
import { localUserStore } from "./localUserStore";

const logger = reactNativeLogs.logger.createLogger().extend("useUser");

export function useUser(parameters?: {
  clerkConfiguration?: { publishableKey: string };
}): User {
  const clerkConfiguration = parameters?.clerkConfiguration;
  const { isLoaded: clerkIsLoaded, user: clerkUser } = clerkConfiguration
    ? useClerkUser()
    : { isLoaded: false, user: null };
  if (clerkUser != null) {
    logger.debug(
      "returning authenticated user from Clerk:",
      JSON.stringify(clerkUser),
    );
    return {
      "@id": clerkUser.id,
      "@type": "AuthenticatedUser",
    };
  }
  if (clerkIsLoaded) {
    logger.debug("no authenticated user from Clerk but Clerk is loaded");
  }

  const localUser = localUserStore.getLocalUserSync();
  if (localUser !== null) {
    logger.debug("returning user from local store:", localUser);
    return localUser;
  }

  logger.debug("returning unauthenticated user");
  return {
    "@type": "UnauthenticatedUser",
  };
}
