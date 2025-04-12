import { useUser as useClerkUser } from "@clerk/clerk-expo";
import { configuration } from "~/configuration";
import { logger } from "~/logger";
import type { User } from "~/models";
import { localUserStore } from "~/stores/localUserStore";

export function useUser(): User {
  const { isLoaded: clerkIsLoaded, user: clerkUser } = configuration.clerk
    ? useClerkUser()
    : { isLoaded: false, user: null };
  if (clerkUser != null) {
    logger.debug(
      "useUser: returning authenticated user from Clerk:",
      JSON.stringify(clerkUser),
    );
    return {
      "@id": clerkUser.id,
      "@type": "AuthenticatedUser",
    };
  }
  if (clerkIsLoaded) {
    logger.debug(
      "useUser: no authenticated user from Clerk but Clerk is loaded",
    );
  }

  const localUser = localUserStore.getLocalUserSync();
  if (localUser !== null) {
    logger.debug("useUser: returning user from local store:", localUser);
    return localUser;
  }

  logger.debug("useUser: returning unauthenticated user");
  return {
    "@type": "UnauthenticatedUser",
  };
}
