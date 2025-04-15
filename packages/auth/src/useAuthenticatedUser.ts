import type { AuthenticatedUser } from "./AuthenticatedUser";
import { useUser } from "./useUser";

export function useAuthenticatedUser(): AuthenticatedUser {
  const user = useUser();
  if (user["@type"] !== "AuthenticatedUser") {
    throw new Error("user is not authenticated");
  }
  return user;
}
