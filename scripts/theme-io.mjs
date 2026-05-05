import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const themeRoot = path.join(repoRoot, "themes");

export const semanticColorKeys = [
  "background",
  "foreground",
  "surface",
  "surfaceAlt",
  "primary",
  "onPrimary",
  "accent",
  "onAccent",
  "cta",
  "onCta",
  "border",
  "muted",
  "mutedForeground",
  "success",
  "onSuccess",
  "warning",
  "onWarning",
  "danger",
  "onDanger",
  "focusRing"
];

export const contrastPairs = [
  ["background", "foreground"],
  ["surface", "foreground"],
  ["surfaceAlt", "foreground"],
  ["primary", "onPrimary"],
  ["accent", "onAccent"],
  ["cta", "onCta"],
  ["muted", "mutedForeground"],
  ["success", "onSuccess"],
  ["warning", "onWarning"],
  ["danger", "onDanger"]
];

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeText(filePath, contents) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents);
}

export async function getThemeDirs() {
  if (!existsSync(themeRoot)) {
    return [];
  }

  const entries = await readdir(themeRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function assertHex(value, label) {
  if (typeof value !== "string" || !/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`${label} must be a #RRGGBB hex color.`);
  }
}

export function tokenValue(token, label) {
  if (!token || typeof token !== "object" || !("$value" in token)) {
    throw new Error(`${label} must be a DTCG token object with $value.`);
  }

  return token.$value;
}

export function resolveColor(value, brandColors, label) {
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string color value or brand reference.`);
  }

  const refMatch = value.match(/^\{brand\.colors\.([a-zA-Z0-9_-]+)\}$/);
  if (refMatch) {
    const colorName = refMatch[1];
    const color = brandColors[colorName];
    if (!color) {
      throw new Error(`${label} references missing brand color "${colorName}".`);
    }

    return tokenValue(color, `brand.colors.${colorName}`);
  }

  return value;
}

export async function loadTheme(name) {
  const dir = path.join(themeRoot, name);
  const brand = await readJson(path.join(dir, "brand.palette.json"));
  const light = await readJson(path.join(dir, "semantic.light.json"));
  const dark = await readJson(path.join(dir, "semantic.dark.json"));

  return { name, dir, brand, modes: { light, dark } };
}

export function validateTheme(theme) {
  const { name, brand, modes } = theme;

  if (brand.id !== name) {
    throw new Error(`${name}: brand.id must match theme directory name.`);
  }

  if (!brand.name || typeof brand.name !== "string") {
    throw new Error(`${name}: brand.name is required.`);
  }

  if (!Array.isArray(brand.mood) || brand.mood.length === 0) {
    throw new Error(`${name}: brand.mood must be a non-empty array.`);
  }

  if (!brand.colors || typeof brand.colors !== "object") {
    throw new Error(`${name}: brand.colors is required.`);
  }

  for (const [colorName, colorToken] of Object.entries(brand.colors)) {
    assertHex(tokenValue(colorToken, `${name}: brand.colors.${colorName}`), `${name}: brand.colors.${colorName}`);
  }

  for (const modeName of ["light", "dark"]) {
    const mode = modes[modeName];
    if (mode.mode !== modeName) {
      throw new Error(`${name}: semantic.${modeName}.json mode must be "${modeName}".`);
    }

    if (!mode.colors || typeof mode.colors !== "object") {
      throw new Error(`${name}: semantic.${modeName}.json colors are required.`);
    }

    for (const key of semanticColorKeys) {
      const value = tokenValue(mode.colors[key], `${name}.${modeName}.colors.${key}`);
      const resolved = resolveColor(value, brand.colors, `${name}.${modeName}.colors.${key}`);
      assertHex(resolved, `${name}.${modeName}.colors.${key}`);
    }
  }
}

export function resolveTheme(theme) {
  const resolved = {
    id: theme.name,
    name: theme.brand.name,
    mood: theme.brand.mood,
    typography: theme.brand.typography ?? {},
    density: theme.brand.density ?? "balanced",
    modes: {}
  };

  for (const modeName of ["light", "dark"]) {
    resolved.modes[modeName] = {
      colors: Object.fromEntries(
        semanticColorKeys.map((key) => [
          key,
          resolveColor(tokenValue(theme.modes[modeName].colors[key], `${theme.name}.${modeName}.${key}`), theme.brand.colors, `${theme.name}.${modeName}.${key}`)
        ])
      )
    };
  }

  return resolved;
}

function channelToLinear(channel) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

export function contrastRatio(foreground, background) {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex) {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((part) => Number.parseInt(part, 16))
    .map(channelToLinear);

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
