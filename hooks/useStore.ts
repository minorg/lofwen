import { useStore as useUnderlyingStore } from "tinybase/ui-react";
import type { Store } from "~/stores";
import { TinyBaseStore } from "~/stores/TinyBaseStore";

export function useStore(): Store {
  const underlyingStore = useUnderlyingStore();
  if (!underlyingStore) {
    throw new Error("no TinyBase store available");
  }
  return new TinyBaseStore(underlyingStore! as any);
}
