import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { Store } from "~/Store";
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
  const { colorScheme, isDarkColorScheme } = useColorScheme();
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

  return (
    <>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <Store.UiReact.Provider store={Store.create()}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack
            screenOptions={{
              ...(process.env.EXPO_OS !== "ios"
                ? {}
                : {
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBlurEffect: "systemChromeMaterial",
                    headerLargeTitleShadowVisible: false,
                    headerShadowVisible: true,
                    headerLargeStyle: {
                      // NEW: Make the large title transparent to match the background.
                      backgroundColor: "transparent",
                    },
                  }),
            }}
          >
            <Stack.Screen name="action/[actionIdentifier]" />
          </Stack>
        </Store.UiReact.Provider>
      </ThemeProvider>
    </>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
