import { useTheme as useReactNavigationTheme } from "@react-navigation/native";
import type { Theme } from "~/themes/Theme";

export function useTheme(): Theme {
  return useReactNavigationTheme() as Theme;
}
