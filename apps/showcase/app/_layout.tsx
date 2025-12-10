import "~/global.css";

import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configuration } from "~/configuration";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/setAndroidNavigationBar";
import { navTheme } from "~/navTheme";
import { rootLogger } from "~/rootLogger";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const logger = rootLogger.extend("RootLayout");

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setAndroidNavigationBar({ colorScheme });
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    logger.debug("color scheme isn't loaded, returning null on first render");
    return null;
  }

  let element = (
    <ThemeProvider value={isDarkColorScheme ? navTheme.dark : navTheme.light}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
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
