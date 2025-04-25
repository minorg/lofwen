import type { Theme as ReactNavigationTheme } from "@react-navigation/native";

export interface Theme extends ReactNavigationTheme {
  colors: ReactNavigationTheme["colors"] & {
    accent: string;
    accentForeground: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    destructive: string;
    destructiveForeground: string;
    cardForeground: string;
    foreground: string;
    input: string;
    muted: string;
    mutedForeground: string;
    popover: string;
    popoverForeground: string;
    primaryForeground: string;
    ring: string;
    secondary: string;
    secondaryForeground: string;
  };
}
