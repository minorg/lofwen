import "~/global.css";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { Hrefs } from "~/Hrefs";
import { useUser } from "~/hooks/useUser";
import { SynchronizedStore } from "~/stores/SynchronizedStore";

export default function AuthenticatedLayout() {
  const user = useUser();

  if (user["@type"] === "UnauthenticatedUser") {
    return <Redirect href={Hrefs.signIn} />;
  }

  return (
    <SynchronizedStore.UiReact.Provider store={SynchronizedStore.create()}>
      <Stack screenOptions={{ headerShown: false }} />
    </SynchronizedStore.UiReact.Provider>
  );
}
