# Cosmetic Brand Quickstart

This guide shows the exact workflow for building a cosmetic brand landing page in a separate product repo with DesignC v2.

## 1. Create The Product Repo

```bash
pnpm create next-app lumiere-site
cd lumiere-site
```

## 2. Install DesignC

After npm publishing:

```bash
pnpm add @designc/ui-web @designc/theme
```

Before npm publishing, use local links:

```json
{
  "dependencies": {
    "@designc/theme": "link:../design-system-v2/packages/theme",
    "@designc/ui-web": "link:../design-system-v2/packages/ui-web"
  }
}
```

When using local links, build DesignC first:

```bash
cd ../design-system-v2
pnpm build
cd ../lumiere-site
pnpm install
```

## 3. Import DesignC CSS

In `app/globals.css`:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
@import "./brand.theme.css";
```

`@designc/ui-web/styles.css` brings HeroUI styles and built-in DesignC theme CSS.

`brand.theme.css` is generated from this product repo's own brand palette.

## 4. Create The Brand Theme

Create this folder in the product repo:

```txt
designc-theme/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

The fastest safe start is to copy the cosmetics starter theme:

```bash
cp -R ../design-system-v2/themes/cosmetics ./designc-theme
rm -rf ./designc-theme/generated
```

Then update `designc-theme/brand.palette.json`:

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
    "cream": { "$type": "color", "$value": "#EFE4D7" },
    "shell": { "$type": "color", "$value": "#FFFDF8" },
    "ink": { "$type": "color", "$value": "#2B241F" },
    "leaf": { "$type": "color", "$value": "#4F6F52" },
    "rose": { "$type": "color", "$value": "#9A4A53" },
    "clay": { "$type": "color", "$value": "#DED2C4" },
    "deepBrown": { "$type": "color", "$value": "#171411" }
  }
}
```

The `id` is the theme id used by the app.

## 5. Map Palette Colors To Semantic Roles

Edit `semantic.light.json` and `semantic.dark.json`.

Product code should not use raw palette names like `rose` or `leaf` directly. It should use semantic roles such as `background`, `surface`, `primary`, `cta`, and `border`.

Example:

```json
{
  "background": { "$type": "color", "$value": "{brand.colors.porcelain}" },
  "foreground": { "$type": "color", "$value": "{brand.colors.ink}" },
  "surface": { "$type": "color", "$value": "{brand.colors.shell}" },
  "primary": { "$type": "color", "$value": "{brand.colors.leaf}" },
  "accent": { "$type": "color", "$value": "{brand.colors.rose}" },
  "cta": { "$type": "color", "$value": "{brand.colors.ink}" },
  "border": { "$type": "color", "$value": "{brand.colors.clay}" }
}
```

## 6. Validate And Build The Theme CSS

```bash
pnpm exec designc-theme validate ./designc-theme
pnpm exec designc-theme check-contrast ./designc-theme
pnpm exec designc-theme build ./designc-theme --out ./app/brand.theme.css
```

If contrast fails, adjust `semantic.light.json` or `semantic.dark.json` before continuing.

## 7. Apply The Theme At The App Root

Use static attributes for the most zero-runtime setup.

In `app/layout.tsx`:

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-dc-theme="lumiere-skin" data-dc-mode="light">
      <body>{children}</body>
    </html>
  );
}
```

`data-dc-theme` must match `brand.palette.json`'s `id`.

## 8. Build The Page With DesignC Components

In `app/page.tsx`:

```tsx
import { Button, Card } from "@designc/ui-web";

export default function CosmeticBrandPage() {
  return (
    <main className="bg-[var(--dc-color-background)] text-[var(--dc-color-foreground)]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-6 px-6">
        <p className="text-sm uppercase tracking-normal text-[var(--dc-color-muted-foreground)]">
          Lumiere Skin
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold">
          Clinical skincare with a sensory finish.
        </h1>
        <p className="max-w-2xl text-lg text-[var(--dc-color-muted-foreground)]">
          A focused product story built from shared UI structure and a brand-owned palette.
        </p>
        <Button>Shop the serum</Button>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Ingredient Story</Card.Title>
          </Card.Header>
          <Card.Body>Clear roles, restrained surfaces, and product-first color.</Card.Body>
        </Card>
      </section>
    </main>
  );
}
```

## 9. Work Rule

Keep product-specific brand colors in `designc-theme/*`.

Use DesignC components and semantic CSS variables in app UI:

```tsx
className="bg-[var(--dc-color-surface)] text-[var(--dc-color-foreground)] border-[var(--dc-color-border)]"
```

Promote the theme into `design-system-v2/themes/*` only when multiple products should reuse it.
