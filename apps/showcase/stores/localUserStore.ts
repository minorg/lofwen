import { AuthenticatedUser } from "@lofwen/models";

import * as SecureStore from "expo-secure-store";

class LocalUserStore {
  private readonly key = "localUser";

  clearLocalUserAsync(): Promise<void> {
    // logger.debug("clearing local user");
    return SecureStore.deleteItemAsync(this.key);
  }

  getLocalUserSync(): AuthenticatedUser | null {
    const value = SecureStore.getItem(this.key);
    if (value === null) {
      // logger.debug("no local user in local key-value store");
      return null;
    }
    // logger.debug("local user JSON in local key-value store:", value);
    const parseResult = AuthenticatedUser.schema.safeParse(JSON.parse(value));
    if (parseResult.success) {
      return parseResult.data;
    }
    // logger.warn("failed to parse local user:", parseResult.error);
    return null;
  }

  setLocalUserAsync(user: AuthenticatedUser): Promise<void> {
    // logger.debug("setting local user");
    return SecureStore.setItemAsync(this.key, JSON.stringify(user));
  }

  setLocalUserSync(user: AuthenticatedUser): void {
    // logger.debug("setting local user");
    SecureStore.setItem(this.key, JSON.stringify(user));
  }
}

export const localUserStore = new LocalUserStore();
