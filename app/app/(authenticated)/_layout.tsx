import "~/global.css";
import {} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { Hrefs } from "~/Hrefs";
import { Store } from "~/Store";
import { useUser } from "~/hooks/useUser";

export default function AuthenticatedLayout() {
  const user = useUser();

  if (user["@type"] === "UnauthenticatedUser") {
    return <Redirect href={Hrefs.signIn} />;
  }

  return (
    <Store.UiReact.Provider store={Store.create()}>
      <Stack screenOptions={{ headerShown: false }} />
    </Store.UiReact.Provider>
  );
}
