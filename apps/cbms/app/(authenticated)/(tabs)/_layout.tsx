import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { screenOptions } from "~/components/screenOptions";
import { useTheme } from "~/hooks/useTheme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        tabBarActiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarInactiveTintColor: colors.secondary,
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
  );
}
