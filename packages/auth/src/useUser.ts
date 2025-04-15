import { useUser as useClerkUser } from "@clerk/clerk-expo";
import type { Configuration } from "./Configuration";
import type { User } from "./User";
import { localUserStore } from "./localUserStore";

export function useUser({
  configuration,
  logger,
}: {
  configuration: Configuration;
  logger: { debug: (...args: unknown[]) => void };
}): User {
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
