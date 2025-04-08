import { useUser as useClerkUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { configuration } from "~/configuration";
import { secureStoreKeys } from "~/constants/secureStoreKeys";
import { logger } from "~/logger";
import type { User } from "~/models";

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

  const localUserId =
    Platform.OS === "web"
      ? localStorage.getItem(secureStoreKeys.localUserId)
      : SecureStore.getItem(secureStoreKeys.localUserId);
  if (localUserId !== null) {
    logger.debug(
      "useUser: returning local user from secure store:",
      localUserId,
    );
    return {
      "@id": localUserId,
      "@type": "AuthenticatedUser",
    };
  }

  logger.debug("useUser: returning unauthenticated user");
  return {
    "@type": "UnauthenticatedUser",
  };
}
