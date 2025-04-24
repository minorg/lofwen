import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import {} from "@react-navigation/native";
import { cssInterop, useColorScheme } from "nativewind";

import type { Theme } from "@react-navigation/native";

import type { PropsWithChildren, ReactNode } from "react";
import "../global.css";
import { Platform } from "react-native";

const WEB_FONT_STACK =
  'OpenSans, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

// https://github.com/nativewind/nativewind/issues/682#issuecomment-2363863605
export const ReactNavigationThemeProvider = cssInterop(
  ({
    children,
    ...colors
  }: Theme["colors"] & { readonly children: ReactNode }) => {
    const { colorScheme } = useColorScheme();

    return (
      <ThemeProvider
        value={{
          colors,
          dark: colorScheme === "dark",
          fonts:
            // https://reactnavigation.org/docs/themes/
            Platform.select({
              default: {
                regular: {
                  fontFamily: "sans-serif",
                  fontWeight: "normal",
                },
                medium: {
                  fontFamily: "sans-serif-medium",
                  fontWeight: "normal",
                },
                bold: {
                  fontFamily: "sans-serif",
                  fontWeight: "600",
                },
                heavy: {
                  fontFamily: "sans-serif",
                  fontWeight: "700",
                },
              },
              ios: {
                regular: {
                  fontFamily: "System",
                  fontWeight: "400",
                },
                medium: {
                  fontFamily: "System",
                  fontWeight: "500",
                },
                bold: {
                  fontFamily: "System",
                  fontWeight: "600",
                },
                heavy: {
                  fontFamily: "System",
                  fontWeight: "700",
                },
              },
              web: {
                regular: {
                  fontFamily: WEB_FONT_STACK,
                  fontWeight: "400",
                },
                medium: {
                  fontFamily: WEB_FONT_STACK,
                  fontWeight: "500",
                },
                bold: {
                  fontFamily: WEB_FONT_STACK,
                  fontWeight: "600",
                },
                heavy: {
                  fontFamily: WEB_FONT_STACK,
                  fontWeight: "700",
                },
              },
            }),
        }}
      >
        {children}
      </ThemeProvider>
    );
  },
  Object.fromEntries(
    Object.keys(DefaultTheme.colors).map((name) => [
      name,
      {
        target: name,
        nativeStyleToProp: {
          color: name,
        },
      },
    ]),
  ) as {
    [K in keyof Theme["colors"]]: {
      target: K;
      nativeStyleToProp: {
        color: K;
      };
    };
  },
);

export function DefaultReactNavigationThemeProvider({
  children,
}: PropsWithChildren) {
  return (
    <ReactNavigationThemeProvider
      background="tw-text-background"
      border="tw-text-border"
      card="tw-text-card"
      notification="tw-text-background"
      primary="tw-text-primary"
      text="tw-text-foreground"
    >
      {children}
    </ReactNavigationThemeProvider>
  );
}
