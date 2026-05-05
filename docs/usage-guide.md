# Usage Guide

This document explains how to use DesignC v2 in product work.

## Current Support Level

DesignC v2 is currently a workspace-first design system scaffold.

Supported now:

- Build product apps inside this monorepo under `apps/*`.
- Consume DesignC packages through pnpm workspace dependencies or local `link:` dependencies.
- Use built-in Web theme CSS through `@designc/ui-web/styles.css`.
- Apply Web theme and mode through `DesignCProvider`.
- Build project-local Web theme CSS with the `designc-theme` CLI.
- Use Native resolved theme objects from `@designc/theme`.
- Use HeroUI only through DesignC wrapper packages.

Not productionized yet:

- public npm package publishing.
- versioned package release workflow.
- automatic Uniwind variable generation for every Native theme.

Until package publishing is added, use apps inside this repo or `link:` the local packages from an external product repo.

## Package Roles

Use these packages from product apps:

```txt
@designc/foundation  non-color structure tokens
@designc/theme       theme registry, local theme CLI, resolved theme objects
@designc/ui-web      HeroUI React wrapper and bundled Web CSS
@designc/ui-native   HeroUI Native wrapper
```

Product apps should not import:

```ts
import { Button } from "@heroui/react";
import { Button } from "heroui-native";
```

Use:

```ts
import { Button } from "@designc/ui-web";
import { Button } from "@designc/ui-native";
```

## Web App Setup

Create a Next.js app under `apps/my-web-app`, or use the same shape in a separate product repo.

`apps/my-web-app/package.json`:

```json
{
  "name": "@designc/my-web-app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "@designc/theme": "workspace:*",
    "@designc/ui-web": "workspace:*",
    "@tailwindcss/postcss": "^4.2.4",
    "next": "^16.2.4",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "tailwindcss": "^4.2.1"
  }
}
```

`app/globals.css`:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";

body {
  margin: 0;
  background: var(--dc-color-background);
  color: var(--dc-color-foreground);
}
```

If the product has a project-local theme, import its generated CSS after DesignC:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
@import "./brand.theme.css";
```

Set the active theme and mode with `DesignCProvider`:

```tsx
import { DesignCProvider } from "@designc/ui-web";

export default function Page() {
  return (
    <DesignCProvider as="main" theme="muen" mode="dark">
      <App />
    </DesignCProvider>
  );
}
```

Use semantic CSS variables for custom layout:

```tsx
export function Panel() {
  return (
    <section className="rounded-[8px] border border-[var(--dc-color-border)] bg-[var(--dc-color-surface)] text-[var(--dc-color-foreground)]">
      Content
    </section>
  );
}
```

Use wrapped components:

```tsx
import { Button, Card, Input } from "@designc/ui-web";

export function LeadForm() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Talk to us</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input placeholder="Email" />
        <Button variant="primary">Send</Button>
      </Card.Content>
    </Card>
  );
}
```

## Web Theme Switching

Use `DesignCProvider` from `@designc/ui-web` and theme names from `@designc/theme`.

```tsx
"use client";

import { useState } from "react";
import { themeNames, type DesignCThemeMode, type DesignCThemeName } from "@designc/theme";
import { DesignCProvider } from "@designc/ui-web";

export function ThemeFrame({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<DesignCThemeName>("company-landing");
  const [mode, setMode] = useState<DesignCThemeMode>("light");

  return (
    <DesignCProvider as="main" theme={themeName} mode={mode}>
      {themeNames.map((name) => (
        <button key={name} onClick={() => setThemeName(name)}>
          {name}
        </button>
      ))}
      <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
        Toggle mode
      </button>
      {children}
    </DesignCProvider>
  );
}
```

## External Web Project Workflow

After npm publishing is ready, a product repo should install the public packages:

```bash
pnpm add @designc/ui-web @designc/theme
```

Before publishing, use local package links from the product repo:

```json
{
  "dependencies": {
    "@designc/theme": "link:../design-system-v2/packages/theme",
    "@designc/ui-web": "link:../design-system-v2/packages/ui-web"
  }
}
```

Build the design system packages before running the product app:

```bash
cd ../design-system-v2
pnpm build
cd ../my-product
pnpm install
pnpm dev
```

The product app setup stays the same after npm publishing. Only the dependency spec changes from `link:` to versioned npm packages.

## Project-Local Brand Theme

Use a project-local theme when a product has its own brand palette but does not need to become a reusable DesignC starter theme yet.

Create this in the product repo:

```txt
designc-theme/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

Example `brand.palette.json` for a cosmetic brand:

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "id": "lumiere-skin",
  "name": "Lumiere Skin",
  "mood": ["clinical", "sensory", "quiet-luxury"],
  "density": "editorial",
  "typography": {
    "display": "high-contrast serif",
    "body": "quiet grotesk sans"
  },
  "colors": {
    "porcelain": { "$type": "color", "$value": "#F8F3EC" },
    "ink": { "$type": "color", "$value": "#2B241F" },
    "leaf": { "$type": "color", "$value": "#4F6F52" },
    "rose": { "$type": "color", "$value": "#9A4A53" }
  }
}
```

Run the local theme checks:

```bash
pnpm exec designc-theme validate ./designc-theme
pnpm exec designc-theme check-contrast ./designc-theme
pnpm exec designc-theme build ./designc-theme --out ./app/brand.theme.css
```

Then activate it:

```tsx
import { DesignCProvider } from "@designc/ui-web";

export default function Page() {
  return (
    <DesignCProvider as="main" theme="lumiere-skin" mode="light">
      <CosmeticBrandPage />
    </DesignCProvider>
  );
}
```

Promote a project-local theme into `design-system-v2/themes/*` only when it should be reused by multiple products.

## Native App Setup

Create an Expo app under `apps/my-native-app`.

Use the playground as the baseline:

- `apps/playground-native/app/_layout.tsx`
- `apps/playground-native/global.css`
- `apps/playground-native/metro.config.js`
- `apps/playground-native/app/index.tsx`

Required dependencies include:

```json
{
  "dependencies": {
    "@designc/theme": "workspace:*",
    "@designc/ui-native": "workspace:*",
    "@gorhom/bottom-sheet": "^5.2.8",
    "expo": "^55.0.23",
    "expo-router": "^55.0.14",
    "react": "19.2.0",
    "react-native": "^0.83.9",
    "react-native-gesture-handler": "^2.29.1",
    "react-native-reanimated": "^4.3.0",
    "react-native-safe-area-context": "^5.6.2",
    "react-native-screens": "^4.19.0",
    "react-native-svg": "^15.15.1",
    "react-native-worklets": "^0.8.0",
    "tailwindcss": "^4.2.1",
    "uniwind": "^1.6.4"
  }
}
```

Wrap the app with HeroUI Native through the DesignC wrapper:

```tsx
import "../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "@designc/ui-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
```

Use resolved theme objects for Native styling:

```tsx
import { Text, View } from "react-native";
import { Button, Card } from "@designc/ui-native";
import { designcThemes } from "@designc/theme";

const colors = designcThemes.muen.modes.dark.colors;

export function ChatPreview() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}>
        <Card.Body>
          <Text style={{ color: colors.foreground }}>Muen is ready.</Text>
          <Button variant="primary">Start</Button>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## Adding A Reusable Brand Theme

Create:

```txt
themes/my-brand/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

Then run:

```bash
pnpm build:themes
pnpm theme:validate
pnpm check:contrast
pnpm build
```

Use this path for reusable starter themes. For one product only, prefer the project-local workflow above.

If all commands pass, the new theme is available from:

```ts
import { designcThemes, themeNames } from "@designc/theme";
```

## Npm Publish Upgrade Path

Publishing is the cleanest route once multiple independent repos need the system.

Recommended order:

1. Make publishable packages non-private: `@designc/foundation`, `@designc/theme`, `@designc/ui-web`, `@designc/ui-native`.
2. Add `publishConfig.access = "public"` to scoped public packages.
3. Make sure each package has a tight `files` list containing runtime assets, `dist`, and any bin wrappers.
4. Run `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm theme:validate`, `pnpm check:contrast`, and `pnpm check:imports`.
5. Run `pnpm -r pack --pack-destination .qa/packs` and inspect the tarballs.
6. Publish in dependency order: foundation, theme, ui-web, ui-native.
7. In product repos, replace `link:` dependencies with versioned npm packages.

The intended final product install is:

```bash
pnpm add @designc/ui-web @designc/theme
```
