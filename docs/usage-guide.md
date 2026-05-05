# Usage Guide

This document explains how to use DesignC v2 in product work.

## Current Support Level

DesignC v2 is currently a workspace-first design system scaffold.

Supported now:

- Build product apps inside this monorepo under `apps/*`.
- Consume DesignC packages through pnpm workspace dependencies.
- Use Web theme CSS variables through `@designc/theme/themes.css`.
- Use Native resolved theme objects from `@designc/theme`.
- Use HeroUI only through DesignC wrapper packages.

Not productionized yet:

- npm package publishing.
- versioned package release workflow.
- automatic Uniwind variable generation for every Native theme.

Until package publishing is added, the most reliable workflow is to add new apps inside this repo.

## Package Roles

Use these packages from product apps:

```txt
@designc/foundation  non-color structure tokens
@designc/theme       theme registry, generated CSS, resolved theme objects
@designc/ui-web      HeroUI React wrapper
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

Create a Next.js app under `apps/my-web-app`.

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
@import "@designc/theme/themes.css";

body {
  margin: 0;
  background: var(--dc-color-background);
  color: var(--dc-color-foreground);
}
```

Set the active theme and mode on a root element:

```tsx
export default function Page() {
  return (
    <main data-dc-theme="muen" data-dc-mode="dark">
      <App />
    </main>
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

Use `themeNames` and `designcThemes` from `@designc/theme`.

```tsx
"use client";

import { useState } from "react";
import { themeNames, type DesignCThemeMode, type DesignCThemeName } from "@designc/theme";

export function ThemeFrame({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<DesignCThemeName>("company-landing");
  const [mode, setMode] = useState<DesignCThemeMode>("light");

  return (
    <main data-dc-theme={themeName} data-dc-mode={mode}>
      {themeNames.map((name) => (
        <button key={name} onClick={() => setThemeName(name)}>
          {name}
        </button>
      ))}
      <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
        Toggle mode
      </button>
      {children}
    </main>
  );
}
```

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

## Adding A Brand Theme

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

If all commands pass, the new theme is available from:

```ts
import { designcThemes, themeNames } from "@designc/theme";
```

## External Repo Usage

For a completely separate product repo, there are two options.

Option A, local link during development:

```json
{
  "dependencies": {
    "@designc/theme": "link:../design-system-v2/packages/theme",
    "@designc/ui-web": "link:../design-system-v2/packages/ui-web"
  }
}
```

Before running the external app:

```bash
cd ../design-system-v2
pnpm build
```

Option B, package publishing:

Add release metadata, remove package-level `"private": true`, define package `files`, publish `@designc/*` packages, then install them normally in product repos.

Publishing is the correct route for production reuse across independent repos.
