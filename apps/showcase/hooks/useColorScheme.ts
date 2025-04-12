import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useColorScheme as useReactNativeColorScheme } from "react-native";
import { logger } from "~/logger";

export function useColorScheme() {
  let { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const reactNativeColorScheme = useReactNativeColorScheme();

  if (!colorScheme) {
    logger.warn("color scheme is not set, defaulting to dark");
    colorScheme = "dark";
  }

  if (colorScheme !== reactNativeColorScheme) {
    logger.warn(
      `unexpected color scheme mismatch: Nativewind=${colorScheme}, React Native=${reactNativeColorScheme}`,
    );
  }

  return {
    colorScheme,
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
