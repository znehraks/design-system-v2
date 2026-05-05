import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(repoRoot, "apps");
const forbiddenImports = ["@heroui/react", "heroui-native"];
const failures = [];

if (existsSync(appRoot)) {
  for (const filePath of await walk(appRoot)) {
    if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath)) {
      continue;
    }

    const source = await readFile(filePath, "utf8");
    for (const forbiddenImport of forbiddenImports) {
      const importPattern = new RegExp(`from\\s+["']${escapeRegExp(forbiddenImport)}(?:/[^"']*)?["']|import\\(["']${escapeRegExp(forbiddenImport)}(?:/[^"']*)?["']\\)`);
      if (importPattern.test(source)) {
        failures.push(`${path.relative(repoRoot, filePath)} imports ${forbiddenImport}`);
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`HeroUI direct imports are not allowed in apps:\n${failures.join("\n")}`);
}

console.log("Import boundaries validated.");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
