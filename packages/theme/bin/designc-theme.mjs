#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

const cliUrl = new URL("../dist/cli.js", import.meta.url);

if (!existsSync(fileURLToPath(cliUrl))) {
  console.error("@designc/theme is not built yet. Run `pnpm --filter @designc/theme build` first.");
  process.exit(1);
}

await import(cliUrl.href);
