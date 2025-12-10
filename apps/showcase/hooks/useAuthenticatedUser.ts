import type { AuthenticatedUser } from "@lofwen/models";
import { useUser } from "~/hooks/useUser";

export function useAuthenticatedUser(): AuthenticatedUser {
  const user = useUser();
  if (user["@type"] !== "AuthenticatedUser") {
    throw new Error("user is not authenticated");
  }
  return user;
}
