import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/setAndroidNavigationBar";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const toggleColorScheme = useCallback(() => {
    const newColorScheme = isDarkColorScheme ? "light" : "dark";
    setAndroidNavigationBar({ colorScheme: newColorScheme });
    setColorScheme(newColorScheme);
  }, [isDarkColorScheme, setColorScheme]);

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View
          className={cn(
            "flex-1 aspect-square pt-0.5 justify-center items-start web:px-5",
            pressed && "opacity-70",
          )}
        >
          {isDarkColorScheme ? (
            <Ionicons className="text-foreground" name="moon" size={24} />
          ) : (
            <Ionicons className="text-foreground" name="sunny" size={24} />
          )}
        </View>
      )}
    </Pressable>
  );
}
