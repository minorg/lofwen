import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useColorScheme as useReactNativeColorScheme } from "react-native";
import { logger } from "~/logger";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  logger.debug("color scheme according to Nativewind:", colorScheme);
  logger.debug(
    "color scheme according to React Native:",
    useReactNativeColorScheme(),
  );

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
