import { type User, useUser as _useUser } from "@lofwen/auth";
import { configuration } from "~/configuration";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("useUser");

export function useUser(): User {
  return _useUser({ configuration, logger });
}
