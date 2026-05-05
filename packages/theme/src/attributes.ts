import type { DesignCThemeMode, DesignCThemeName } from "./generated.js";

export type { DesignCThemeMode, DesignCThemeName } from "./generated.js";

export type DesignCThemeId = DesignCThemeName | (string & {});

export function createThemeAttributes(theme: DesignCThemeId, mode: DesignCThemeMode = "light") {
  return {
    "data-dc-theme": theme,
    "data-dc-mode": mode
  } as const;
}
