import "~/global.css";

import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { configuration } from "~/configuration";
import { navTheme } from "~/constants/navTheme";
import { useColorScheme } from "~/hooks/useColorScheme";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: navTheme.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: navTheme.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  let element = (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Slot />
    </ThemeProvider>
  );

  if (configuration.clerk) {
    element = (
      <ClerkProvider
        publishableKey={configuration.clerk.publishableKey}
        tokenCache={tokenCache}
      >
        <ClerkLoaded>{element}</ClerkLoaded>
      </ClerkProvider>
    );
  }

  return element;
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
