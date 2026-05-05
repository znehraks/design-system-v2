import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  checkThemeContrast,
  renderThemeCss,
  resolveThemePack,
  validateThemePack,
  type DesignCThemeMode,
  type LocalBrandPalette,
  type LocalSemanticTheme
} from "./core.js";

export async function readLocalThemePack(themeDir: string) {
  const brand = await readJson<LocalBrandPalette>(path.join(themeDir, "brand.palette.json"));
  const name = brand.id || path.basename(themeDir);
  const light = await readJson<LocalSemanticTheme>(path.join(themeDir, "semantic.light.json"));
  const dark = await readJson<LocalSemanticTheme>(path.join(themeDir, "semantic.dark.json"));

  return {
    name,
    brand,
    modes: {
      light,
      dark
    } satisfies Record<DesignCThemeMode, LocalSemanticTheme>
  };
}

export async function validateLocalThemePack(themeDir: string) {
  const theme = await readLocalThemePack(themeDir);
  validateThemePack(theme);
  return theme;
}

export async function buildLocalThemeCss(themeDir: string, outFile: string) {
  const theme = await validateLocalThemePack(themeDir);
  const resolved = resolveThemePack(theme);
  const failures = checkThemeContrast(resolved);

  if (failures.length > 0) {
    throw new Error(`Theme contrast failures:\n${failures.join("\n")}`);
  }

  const css = renderThemeCss(resolved.id, resolved);
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, css);
  return { resolved, outFile };
}

export async function checkLocalThemeContrast(themeDir: string) {
  const theme = await validateLocalThemePack(themeDir);
  const resolved = resolveThemePack(theme);
  return checkThemeContrast(resolved);
}

async function readJson<T>(filePath: string) {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}
