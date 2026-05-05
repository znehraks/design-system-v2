# Wrapper Import Policy

Apps must consume DesignC wrappers, not HeroUI packages directly.

## Allowed

Web apps:

```ts
import { Button, Card, DesignCProvider } from "@designc/ui-web";
```

Native apps:

```ts
import { Button, Card } from "@designc/ui-native";
```

## Not Allowed In Apps

```ts
import { Button } from "@heroui/react";
import { Button } from "heroui-native";
```

Direct HeroUI imports are allowed only inside:

- `packages/ui-web`
- `packages/ui-native`

## Why

The wrapper boundary lets DesignC keep app code stable while HeroUI evolves. It also gives us one place to add future DesignC defaults, telemetry, accessibility conventions, or component-level token mapping.

`DesignCProvider` is also part of this boundary. Product apps should use it instead of manually setting `data-dc-theme` and `data-dc-mode` throughout the codebase.

The policy is enforced by:

```bash
pnpm lint
pnpm check:imports
```
