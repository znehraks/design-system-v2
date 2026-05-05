#!/usr/bin/env node
import path from "node:path";
import { buildLocalThemeCss, checkLocalThemeContrast, validateLocalThemePack } from "./node.js";

const [command, themeDirArg, ...rest] = process.argv.slice(2);
const themeDir = path.resolve(themeDirArg ?? "designc-theme");

try {
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
  }

  if (command === "validate") {
    await validateLocalThemePack(themeDir);
    console.log(`Validated ${themeDir}.`);
    process.exit(0);
  }

  if (command === "check-contrast") {
    const failures = await checkLocalThemeContrast(themeDir);
    if (failures.length > 0) {
      throw new Error(`Theme contrast failures:\n${failures.join("\n")}`);
    }

    console.log(`Checked contrast for ${themeDir}.`);
    process.exit(0);
  }

  if (command === "build") {
    const outIndex = rest.indexOf("--out");
    const outFile = path.resolve(outIndex >= 0 ? rest[outIndex + 1] : path.join(themeDir, "theme.css"));
    await buildLocalThemeCss(themeDir, outFile);
    console.log(`Built ${outFile}.`);
    process.exit(0);
  }

  throw new Error(`Unknown command "${command}".`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

function printHelp() {
  console.log(`designc-theme

Usage:
  designc-theme validate <theme-dir>
  designc-theme check-contrast <theme-dir>
  designc-theme build <theme-dir> --out <css-file>

Theme directory must contain:
  brand.palette.json
  semantic.light.json
  semantic.dark.json
`);
}
