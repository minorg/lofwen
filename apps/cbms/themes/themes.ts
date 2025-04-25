import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import invariant from "ts-invariant";
// Version of global.css from css2json
import globalCssJson from "~/global.css.json";
import type { Theme } from "~/themes/Theme";

function cssColors(scheme: "dark" | "light"): Theme["colors"] {
  function cssColor(property: string): string {
    const declarations =
      scheme === "dark"
        ? globalCssJson.stylesheet.rules[1].declarations
        : globalCssJson.stylesheet.rules[0].declarations;
    const declaration = declarations.find(
      (declaration) => declaration.property === property,
    );
    invariant(declaration, property);
    return `hsl(${declaration.value})`;
  }

  return {
    accent: cssColor("--accent"),
    accentForeground: cssColor("--accent-foreground"),
    background: cssColor("--background"),
    border: cssColor("--border"),
    card: cssColor("--card"),
    cardForeground: cssColor("--card-foreground"),
    chart1: cssColor("--chart-1"),
    chart2: cssColor("--chart-2"),
    chart3: cssColor("--chart-3"),
    chart4: cssColor("--chart-4"),
    chart5: cssColor("--chart-5"),
    destructive: cssColor("--destructive"),
    destructiveForeground: cssColor("--destructive-foreground"),
    foreground: cssColor("--foreground"),
    input: cssColor("--input"),
    muted: cssColor("--muted"),
    mutedForeground: cssColor("--muted-foreground"),
    notification: cssColor("--destructive"),
    popover: cssColor("--popover"),
    popoverForeground: cssColor("--popover-foreground"),
    primary: cssColor("--primary"),
    primaryForeground: cssColor("--primary-foreground"),
    ring: cssColor("--ring"),
    secondary: cssColor("--secondary"),
    secondaryForeground: cssColor("--secondary-foreground"),
    text: cssColor("--foreground"),
  };
}

export const themes: Record<"dark" | "light", Theme> = {
  dark: {
    ...DarkTheme,
    colors: cssColors("dark"),
  },
  light: {
    ...DefaultTheme,
    colors: cssColors("light"),
  },
};
