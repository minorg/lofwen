import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Hrefs } from "~/Hrefs";
import { secureStoreKeys } from "~/constants/secureStoreKeys";

export default function SignOutScreen() {
  const { loaded: clerkLoaded, signOut: clerkSignOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (clerkLoaded) {
      clerkSignOut(() => {
        router.push(Hrefs.root);
      });
    } else {
      if (Platform.OS === "web") {
        localStorage.removeItem(secureStoreKeys.localUserId);
        router.push(Hrefs.root);
      } else {
        SecureStore.deleteItemAsync(secureStoreKeys.localUserId).then(() =>
          router.push(Hrefs.root),
        );
      }
    }
  }, [clerkLoaded, clerkSignOut, router]);
}
