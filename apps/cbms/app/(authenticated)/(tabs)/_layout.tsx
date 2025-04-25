import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { screenOptions } from "~/components/screenOptions";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        tabBarActiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarInactiveTintColor: colors.text,
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
