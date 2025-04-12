import { useUser } from "~/hooks/useUser";
import type { AuthenticatedUser } from "~/models";

export function useAuthenticatedUser(): AuthenticatedUser {
  const user = useUser();
  if (user["@type"] !== "AuthenticatedUser") {
    throw new Error("user is not authenticated");
  }
  return user;
}
