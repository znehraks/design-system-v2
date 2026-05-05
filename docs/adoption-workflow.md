# Adoption Workflow

This is the recommended workflow when starting a new product with DesignC v2.

## 1. Decide The Product Surface

Pick the target:

- Web landing or app: use `@designc/ui-web`.
- Expo native app: use `@designc/ui-native`.
- Shared brand work: update `themes/*` first.

For now, create product apps inside this monorepo or use local package links from an external repo. After npm publishing is ready, the product workflow stays the same and only the dependency spec changes.

## 2. Pick Or Create A Theme Pack

Use an existing pack when the product mood matches:

```txt
cosmetics         premium, sensory, ingredient-led
group-dating     warm, social, energetic, safe
muen             calm, intelligent, companion-like
company-landing  credible, direct, business-focused
```

Create a new pack when the brand mood is materially different.

Do not force a product into an existing palette just because the semantic token names match.

For a one-product brand, keep the theme in that product repo first:

```txt
designc-theme/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

For a reusable starter, add it under `themes/<theme-id>/` in this repo.

## 3. Scaffold The App

For Web:

```bash
mkdir -p apps/my-product-web
```

Use `apps/playground-web` as the reference setup.

For Native:

```bash
mkdir -p apps/my-product-native
```

Use `apps/playground-native` as the reference setup.

## 4. Consume DesignC Packages

Web app dependencies:

```json
{
  "@designc/theme": "workspace:*",
  "@designc/ui-web": "workspace:*"
}
```

Native app dependencies:

```json
{
  "@designc/theme": "workspace:*",
  "@designc/ui-native": "workspace:*"
}
```

Import wrappers only:

```tsx
import { Button, Card, DesignCProvider, Input } from "@designc/ui-web";
import { Button, Card, Input } from "@designc/ui-native";
```

## 5. Apply Theme At The App Boundary

Web:

```tsx
<DesignCProvider as="main" theme="company-landing" mode="light">
  <ProductApp />
</DesignCProvider>
```

Native:

```tsx
const colors = designcThemes["company-landing"].modes.light.colors;
```

The app can switch theme and mode by changing those values.

For Web CSS, import DesignC once:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
```

If the app has a project-local theme, import the generated file after DesignC:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
@import "./brand.theme.css";
```

## 6. Build Product UI With Semantic Roles

Use DesignC components first.

For custom layout, use semantic tokens:

```tsx
<section className="bg-[var(--dc-color-surface)] text-[var(--dc-color-foreground)] border-[var(--dc-color-border)]">
  ...
</section>
```

Avoid raw brand color references in app UI.

## 7. Validate Before Commit

Run:

```bash
pnpm build
pnpm lint
pnpm test
pnpm theme:validate
pnpm check:contrast
pnpm check:imports
```

For Web UI changes, also run the app and inspect desktop/mobile.

For Native UI changes, run:

```bash
pnpm --filter @designc/playground-native exec expo config --type public
```

Then test in Expo when the UI surface is meaningful.

## 8. Commit And Push

Use one task per commit:

```bash
git add .
git commit -m "feat: add my product web app"
git push origin main
```

## Example Simulation

Scenario: create a new cosmetic brand page in a separate repo.

1. Create the product app:

```bash
pnpm create next-app lumiere-site
cd lumiere-site
```

2. Until npm publish is ready, link the local packages:

```json
{
  "dependencies": {
    "@designc/theme": "link:../design-system-v2/packages/theme",
    "@designc/ui-web": "link:../design-system-v2/packages/ui-web"
  }
}
```

After npm publish, replace those with:

```bash
pnpm add @designc/ui-web @designc/theme
```

3. Import CSS in `app/globals.css`:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
@import "./brand.theme.css";
```

4. Create the product-owned theme:

```txt
designc-theme/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

5. Validate and build the theme CSS:

```bash
pnpm exec designc-theme validate ./designc-theme
pnpm exec designc-theme check-contrast ./designc-theme
pnpm exec designc-theme build ./designc-theme --out ./app/brand.theme.css
```

6. Wrap the page with the theme id from `brand.palette.json`:

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

7. Build sections with wrapper components:

```tsx
import { Button, Card } from "@designc/ui-web";

export function CosmeticBrandPage() {
  return (
    <>
      <section>
        <h1>Lumiere Skin</h1>
        <Button variant="primary">Shop the serum</Button>
      </section>
      <Card>
        <Card.Header>
          <Card.Title>Ingredient notes</Card.Title>
        </Card.Header>
      </Card>
    </>
  );
}
```

8. Use semantic CSS variables for custom layout and keep raw brand colors inside `designc-theme/*`.
9. Run validation.
10. Commit and push the task.

Result: the product app gets shared UI structure, HeroUI behavior, contrast-checked semantic colors, and a brand-specific theme without turning the design system into a single universal palette.
