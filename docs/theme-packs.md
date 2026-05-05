# Theme Packs

Theme packs own brand color and service mood. The design system core does not define one universal color palette.

Each theme lives under `themes/<theme-id>/`:

```txt
brand.palette.json
semantic.light.json
semantic.dark.json
generated/
```

## Brand Palette

`brand.palette.json` defines brand-owned raw colors, typography mood, density, and mood words.

Brand colors are not consumed directly by apps. They are mapped into semantic roles.

## Semantic Files

`semantic.light.json` and `semantic.dark.json` define UI roles:

- background / foreground
- surface / surfaceAlt
- primary / onPrimary
- accent / onAccent
- cta / onCta
- muted / mutedForeground
- success / warning / danger pairs
- border / focusRing

Semantic values may reference brand colors:

```json
{
  "primary": { "$type": "color", "$value": "{brand.colors.signalGreen}" }
}
```

## Build And Validate

```bash
pnpm build:themes
pnpm theme:validate
pnpm check:contrast
```

Generated outputs:

- `themes/*/generated/theme.css`
- `themes/*/generated/theme.native.ts`
- `themes/*/generated/theme.resolved.json`
- `packages/theme/src/generated.ts`
- `packages/theme/src/themes.css`

Contrast checks enforce WCAG AA 4.5:1 for required semantic foreground/background pairs.

## Product-Local Theme CLI

External product repos can keep a one-off theme locally and build it without editing this design system repo.

Create:

```txt
designc-theme/
  brand.palette.json
  semantic.light.json
  semantic.dark.json
```

Run:

```bash
pnpm exec designc-theme validate ./designc-theme
pnpm exec designc-theme check-contrast ./designc-theme
pnpm exec designc-theme build ./designc-theme --out ./app/brand.theme.css
```

Then import the generated CSS after the DesignC Web CSS:

```css
@import "@designc/ui-web/styles.css";
@import "./brand.theme.css";
```

Use the `brand.palette.json` id at the app boundary:

```tsx
<html lang="en" data-dc-theme="my-brand" data-dc-mode="light">
  <body>
    <App />
  </body>
</html>
```
