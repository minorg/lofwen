import { useUser as useClerkUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import type { User } from "~/models";

export function useUser(): User {
  const { user: clerkUser } = useClerkUser();
  if (clerkUser != null) {
    return {
      "@id": clerkUser.id,
      "@type": "AuthenticatedUser",
    };
  }

  const localUserId = SecureStore.getItem("localUserId");
  if (localUserId !== null) {
    return {
      "@id": localUserId,
      "@type": "AuthenticatedUser",
    };
  }

  return {
    "@type": "UnauthenticatedUser",
  };
}
