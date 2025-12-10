import { AuthenticatedUser } from "@lofwen/models";

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

class LocalStorageLocalKeyValueStore {
  async deleteItemAsync(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async getItemAsync(key: string): Promise<string | null> {
    return this.getItemSync(key);
  }

  getItemSync(key: string): string | null {
    return localStorage.getItem(key);
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    this.setItemSync(key, value);
  }

  setItemSync(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

class SecureStoreLocalKeyValueStore {
  deleteItemAsync(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }

  getItemAsync(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  getItemSync(key: string): string | null {
    return SecureStore.getItem(key);
  }

  setItemAsync(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  setItemSync(key: string, value: string): void {
    SecureStore.setItem(key, value);
  }
}

const localKeyValueStore =
  Platform.OS === "web"
    ? new LocalStorageLocalKeyValueStore()
    : new SecureStoreLocalKeyValueStore();

class LocalUserStore {
  private readonly key = "localUser";

  clearLocalUserAsync(): Promise<void> {
    // logger.debug("clearing local user");
    return localKeyValueStore.deleteItemAsync(this.key);
  }

  getLocalUserSync(): AuthenticatedUser | null {
    const value = localKeyValueStore.getItemSync(this.key);
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
    return localKeyValueStore.setItemAsync(this.key, JSON.stringify(user));
  }

  setLocalUserSync(user: AuthenticatedUser): void {
    // logger.debug("setting local user");
    localKeyValueStore.setItemSync(this.key, JSON.stringify(user));
  }
}

export const localUserStore = new LocalUserStore();
