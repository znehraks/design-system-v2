# Adoption Workflow

This is the recommended workflow when starting a new product with DesignC v2.

## 1. Decide The Product Surface

Pick the target:

- Web landing or app: use `@designc/ui-web`.
- Expo native app: use `@designc/ui-native`.
- Shared brand work: update `themes/*` first.

For now, create product apps inside this monorepo unless you are intentionally testing external package linking.

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
import { Button, Card, Input } from "@designc/ui-web";
import { Button, Card, Input } from "@designc/ui-native";
```

## 5. Apply Theme At The App Boundary

Web:

```tsx
<main data-dc-theme="company-landing" data-dc-mode="light">
  <ProductApp />
</main>
```

Native:

```tsx
const colors = designcThemes["company-landing"].modes.light.colors;
```

The app can switch theme and mode by changing those values.

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

Scenario: create a new company landing page.

1. Use the existing `company-landing` theme.
2. Copy the setup pattern from `apps/playground-web`.
3. Create `apps/company-site`.
4. Add workspace dependencies on `@designc/theme` and `@designc/ui-web`.
5. Import CSS in `app/globals.css`:

```css
@import "tailwindcss";
@import "@designc/ui-web/styles.css";
@import "@designc/theme/themes.css";
```

6. Wrap the page:

```tsx
<main data-dc-theme="company-landing" data-dc-mode="light">
  <CompanyLanding />
</main>
```

7. Build sections with wrapper components:

```tsx
import { Button, Card } from "@designc/ui-web";

export function CompanyLanding() {
  return (
    <>
      <section>
        <h1>DesignC Studio</h1>
        <Button variant="primary">Book a call</Button>
      </section>
      <Card>
        <Card.Header>
          <Card.Title>Proof</Card.Title>
        </Card.Header>
      </Card>
    </>
  );
}
```

8. If the brand needs different color emotion, create `themes/designc-studio` instead of changing `company-landing`.
9. Run validation.
10. Commit and push the task.

Result: the product app gets shared UI structure, HeroUI behavior, contrast-checked semantic colors, and a brand-specific theme without turning the design system into a single universal palette.
