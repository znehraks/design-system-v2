# DesignC v2

DesignC v2 is a HeroUI-based design system scaffold for web and native products.

The core direction is:

- shared non-color foundations for UI structure
- brand-owned theme packs for emotional direction
- semantic tokens for UI roles
- thin DesignC wrappers over HeroUI React and HeroUI Native

Applications consume `@designc/ui-web` or `@designc/ui-native`; they do not import HeroUI packages directly.

Web apps import one stylesheet and can apply static themes with attributes:

```css
@import "@designc/ui-web/styles.css";
```

```tsx
<html lang="en" data-dc-theme="cosmetics" data-dc-mode="light">
  <body>
    <App />
  </body>
</html>;
```

Product-local Web themes can be validated and compiled with:

```bash
pnpm exec designc-theme build ./designc-theme --out ./app/brand.theme.css
```

## Workspaces

- `packages/foundation`: non-color DTCG foundation tokens
- `packages/theme`: brand theme pack build, validation, and exports
- `packages/ui-web`: HeroUI React wrapper
- `packages/ui-native`: HeroUI Native wrapper
- `apps/playground-web`: Next.js playground
- `apps/playground-native`: Expo playground

## Commands

```bash
pnpm build
pnpm lint
pnpm test
pnpm theme:validate
pnpm check:contrast
pnpm check:imports
```

Docs:

- [Cosmetic brand quickstart](./docs/cosmetic-brand-quickstart.md)
- [Usage guide](./docs/usage-guide.md)
- [Adoption workflow](./docs/adoption-workflow.md)
- [Token authoring](./docs/token-authoring.md)
- [Theme packs](./docs/theme-packs.md)
- [Wrapper import policy](./docs/import-policy.md)
- [Task workflow](./docs/task-workflow.md)
