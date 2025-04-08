import "~/global.css";
import {} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Store } from "~/Store";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function AuthenticatedLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Store.UiReact.Provider store={Store.create()}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </Store.UiReact.Provider>
  );
}
