import { useUser as useClerkUser } from "@clerk/clerk-expo";
import type { User } from "@lofwen/models";
import { configuration } from "~/configuration";
import { rootLogger } from "~/rootLogger";
import { localUserStore } from "~/stores/localUserStore";

const logger = rootLogger.extend("useUser");

export function useUser(): User {
  const { isLoaded: clerkIsLoaded, user: clerkUser } = configuration.clerk
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
