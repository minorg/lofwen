import * as reactNativeLogs from "react-native-logs";
import { AuthenticatedUser } from "~/AuthenticatedUser";
import { localKeyValueStore } from "~/localKeyValueStore";

const logger = reactNativeLogs.logger.createLogger().extend("LocalUserStore");

class LocalUserStore {
  private readonly key = "localUser";

  clearLocalUserAsync(): Promise<void> {
    logger.debug("clearing local user");
    return localKeyValueStore.deleteItemAsync(this.key);
  }

  getLocalUserSync(): AuthenticatedUser | null {
    const value = localKeyValueStore.getItemSync(this.key);
    if (value === null) {
      logger.debug("no local user in local key-value store");
      return null;
    }
    logger.debug("local user JSON in local key-value store:", value);
    const parseResult = AuthenticatedUser.schema.safeParse(JSON.parse(value));
    if (parseResult.success) {
      return parseResult.data;
    }
    logger.warn("failed to parse local user:", parseResult.error);
    return null;
  }

  setLocalUserAsync(user: AuthenticatedUser): Promise<void> {
    logger.debug("setting local user");
    return localKeyValueStore.setItemAsync(this.key, JSON.stringify(user));
  }

  setLocalUserSync(user: AuthenticatedUser): void {
    logger.debug("setting local user");
    localKeyValueStore.setItemSync(this.key, JSON.stringify(user));
  }
}

export const localUserStore = new LocalUserStore();
