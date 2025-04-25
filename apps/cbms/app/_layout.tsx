import "~/global.css";

import {} from "@clerk/clerk-expo";
import { OpenSans_300Light } from "@expo-google-fonts/open-sans/300Light";
import { OpenSans_300Light_Italic } from "@expo-google-fonts/open-sans/300Light_Italic";
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans/400Regular";
import { OpenSans_400Regular_Italic } from "@expo-google-fonts/open-sans/400Regular_Italic";
import { OpenSans_500Medium } from "@expo-google-fonts/open-sans/500Medium";
import { OpenSans_500Medium_Italic } from "@expo-google-fonts/open-sans/500Medium_Italic";
import { OpenSans_600SemiBold } from "@expo-google-fonts/open-sans/600SemiBold";
import { OpenSans_600SemiBold_Italic } from "@expo-google-fonts/open-sans/600SemiBold_Italic";
import { OpenSans_700Bold } from "@expo-google-fonts/open-sans/700Bold";
import { OpenSans_700Bold_Italic } from "@expo-google-fonts/open-sans/700Bold_Italic";
import { OpenSans_800ExtraBold } from "@expo-google-fonts/open-sans/800ExtraBold";
import { OpenSans_800ExtraBold_Italic } from "@expo-google-fonts/open-sans/800ExtraBold_Italic";
import { useFonts } from "@expo-google-fonts/open-sans/useFonts";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import invariant from "ts-invariant";
// Version of global.css from css2json
import globalCssJson from "~/global.css.json";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/setAndroidNavigationBar";
import { rootLogger } from "~/rootLogger";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const logger = rootLogger.extend("RootLayout");

SplashScreen.preventAutoHideAsync();

function cssColors(scheme: "dark" | "light"): Theme["colors"] {
  function cssColor(property: string): string {
    const declarations =
      scheme === "dark"
        ? globalCssJson.stylesheet.rules[1].declarations
        : globalCssJson.stylesheet.rules[0].declarations;
    const declaration = declarations.find(
      (declaration) => declaration.property === property,
    );
    invariant(declaration);
    return `hsl(${declaration.value})`;
  }

  return {
    background: cssColor("--background"),
    border: cssColor("--border"),
    card: cssColor("--card"),
    notification: cssColor("--destructive"),
    primary: cssColor("--primary"),
    text: cssColor("--foreground"),
  };
}

const reactNavigationThemes: Record<"dark" | "light", Theme> = {
  dark: {
    ...DarkTheme,
    colors: cssColors("dark"),
  },
  light: {
    ...DefaultTheme,
    colors: cssColors("light"),
  },
};

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [colorSchemeLoaded, setColorSchemeLoaded] = React.useState(false);
  const [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold_Italic,
  });

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }

    setAndroidNavigationBar({ colorScheme });
    setColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!colorSchemeLoaded) {
      logger.debug("color scheme isn't loaded");
      return;
    }
    logger.debug("loaded color scheme");

    if (!fontsLoaded) {
      logger.debug("fonts aren't loaded");
      return;
    }
    logger.debug("loaded fonts");

    SplashScreen.hideAsync();
    logger.debug("hid splash screen");
  }, [colorSchemeLoaded, fontsLoaded]);

  return (
    <ThemeProvider
      value={
        isDarkColorScheme
          ? reactNavigationThemes.dark
          : reactNavigationThemes.light
      }
    >
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
