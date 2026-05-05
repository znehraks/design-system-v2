# Token Authoring

DesignC v2 separates stable UI structure from brand emotion.

## Foundation Tokens

`packages/foundation/tokens/*.json` is the source of truth for shared non-color tokens:

- spacing
- radius
- typography scale
- motion
- breakpoints
- z-index
- accessibility thresholds

Foundation tokens must not define brand color, product mood, campaign color, or service-specific surface color.

## Format

Foundation tokens use DTCG-style objects:

```json
{
  "spacing": {
    "4": { "$type": "dimension", "$value": "16px" }
  }
}
```

Run:

```bash
pnpm build:tokens
```

This generates `packages/foundation/src/generated.ts`.

## Rule

If a token answers "how UI is structured", it belongs in foundation.
If it answers "how this brand feels", it belongs in a theme pack.
