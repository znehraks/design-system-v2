# AGENTS.md - DesignC v2

## Task Completion Rules

- One task equals one commit.
- Every completed task must be committed and pushed to `origin main`.
- Do not use `git commit --no-verify`.
- Do not use `git push --force`.
- Before committing, run the verification commands relevant to the task.
- Before pushing, run `git status` and confirm only intended files are staged.
- If push is rejected, run `git pull --rebase origin main`, resolve conflicts, rerun verification, and push again.

## Architecture Rules

- `packages/foundation` owns only non-color foundation tokens.
- Brand color palettes live in `themes/*`.
- Semantic tokens describe UI roles; they are not a substitute for brand identity.
- Apps must not import `@heroui/react` or `heroui-native` directly.
- Web apps consume `@designc/ui-web`.
- Native apps consume `@designc/ui-native`.

## Verification

Run these before ending a task:

```bash
pnpm lint
pnpm test
pnpm build
pnpm theme:validate
pnpm check:contrast
```
