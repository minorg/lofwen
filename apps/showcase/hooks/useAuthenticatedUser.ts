import {
  type AuthenticatedUser,
  useAuthenticatedUser as _useAuthenticatedUser,
} from "@lofwen/auth";
import { configuration } from "~/configuration";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("useAuthenticatedUser");

export function useAuthenticatedUser(): AuthenticatedUser {
  return _useAuthenticatedUser({ configuration, logger });
}
