import {
  contrastPairs,
  contrastRatio,
  getThemeDirs,
  loadTheme,
  resolveTheme,
  validateTheme
} from "./theme-io.mjs";

const themeDirs = await getThemeDirs();
const failures = [];

if (themeDirs.length === 0) {
  throw new Error("No theme packs found in themes/.");
}

for (const themeName of themeDirs) {
  const theme = await loadTheme(themeName);
  validateTheme(theme);
  const resolved = resolveTheme(theme);

  for (const modeName of ["light", "dark"]) {
    const colors = resolved.modes[modeName].colors;
    for (const [backgroundKey, foregroundKey] of contrastPairs) {
      const ratio = contrastRatio(colors[foregroundKey], colors[backgroundKey]);
      if (ratio < 4.5) {
        failures.push(`${themeName}/${modeName} ${foregroundKey} on ${backgroundKey}: ${ratio.toFixed(2)} < 4.5`);
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Theme contrast failures:\n${failures.join("\n")}`);
}

console.log(`Checked contrast for ${themeDirs.length} theme packs.`);
