import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { DefaultReactNavigationThemeProvider } from "~/components/ReactNavigationThemeProvider";
import { screenOptions } from "~/components/screenOptions";

export default function TabLayout() {
  return (
    <DefaultReactNavigationThemeProvider>
      <Tabs screenOptions={{ ...screenOptions }}>
        <Tabs.Screen
          name="garden"
          options={{
            headerTitle: "Garden",
            title: "Garden",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="flower-outline"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            headerTitle: "Garden",
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="chat-outline"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="forum"
          options={{
            headerTitle: "Garden",
            title: "Forum",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="forum-outline"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </DefaultReactNavigationThemeProvider>
  );
}
