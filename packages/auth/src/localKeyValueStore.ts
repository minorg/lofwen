import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Facade over a local key-value store.
 */
interface LocalKeyValueStore {
  deleteItemAsync(key: string): Promise<void>;

  getItemAsync(key: string): Promise<string | null>;
  getItemSync(key: string): string | null;

  setItemAsync(key: string, value: string): Promise<void>;
  setItemSync(key: string, value: string): void;
}

class LocalStorageLocalKeyValueStore implements LocalKeyValueStore {
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

class SecureStoreLocalKeyValueStore implements LocalKeyValueStore {
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

export const localKeyValueStore =
  Platform.OS === "web"
    ? new LocalStorageLocalKeyValueStore()
    : new SecureStoreLocalKeyValueStore();
