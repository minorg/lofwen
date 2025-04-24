import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { DefaultReactNavigationThemeProvider } from "~/components/ReactNavigationThemeProvider";
import { screenOptions } from "~/components/screenOptions";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <DefaultReactNavigationThemeProvider>
      <Tabs
        screenOptions={{
          ...screenOptions,
          // Hack to avoid white overlay
          tabBarActiveBackgroundColor: isDarkColorScheme ? "black" : "white",
          tabBarActiveTintColor: isDarkColorScheme ? "white" : "black",
          tabBarInactiveBackgroundColor: isDarkColorScheme ? "black" : "white",
          tabBarInactiveTintColor: isDarkColorScheme ? "white" : "black",
        }}
      >
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
            headerTitle: "Chat",
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
            headerTitle: "Forum",
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
