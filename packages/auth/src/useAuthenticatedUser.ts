import type { AuthenticatedUser } from "./AuthenticatedUser";
import { useUser } from "./useUser";

export function useAuthenticatedUser(
  parameters: Parameters<typeof useUser>[0],
): AuthenticatedUser {
  const user = useUser(parameters);
  if (user["@type"] !== "AuthenticatedUser") {
    throw new Error("user is not authenticated");
  }
  return user;
}
