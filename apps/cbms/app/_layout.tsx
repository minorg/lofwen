import "~/global.css";

import { ComicRelief_400Regular } from "@expo-google-fonts/comic-relief/400Regular";
import { ComicRelief_700Bold } from "@expo-google-fonts/comic-relief/700Bold";
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
import { ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/setAndroidNavigationBar";
import { rootLogger } from "~/rootLogger";
import { themes } from "~/themes/themes";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const logger = rootLogger.extend("RootLayout");

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  logger.debug("rendering");

  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [colorSchemeLoaded, setColorSchemeLoaded] = React.useState(false);
  const [fontsLoaded] = useFonts({
    ComicRelief_400Regular,
    ComicRelief_700Bold,
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
    <ThemeProvider value={isDarkColorScheme ? themes.dark : themes.light}>
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
