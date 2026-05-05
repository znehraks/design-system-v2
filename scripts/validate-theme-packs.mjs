import { getThemeDirs, loadTheme, validateTheme } from "./theme-io.mjs";

const themeDirs = await getThemeDirs();

if (themeDirs.length === 0) {
  throw new Error("No theme packs found in themes/.");
}

for (const themeName of themeDirs) {
  validateTheme(await loadTheme(themeName));
}

console.log(`Validated ${themeDirs.length} theme packs.`);
