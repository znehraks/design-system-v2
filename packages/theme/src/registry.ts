import { designcThemes, type DesignCThemeMode, type DesignCThemeName } from "./generated.js";

export function getThemeColors(themeName: DesignCThemeName, mode: DesignCThemeMode = "light") {
  return designcThemes[themeName].modes[mode].colors;
}
