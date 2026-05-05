# Task Workflow

This repo uses small task commits.

## Start A Long Task

When working in Codex, register the long-running objective:

```txt
/goal Complete DesignC v2 HeroUI web/native design system scaffold: create and push public GitHub repo, initialize pnpm monorepo, implement foundation/theme/ui-web/ui-native packages, add web/native playgrounds, add four starter theme packs, pass validation/lint/test/build, and commit plus push every completed task to main.
```

Use `/goal` during work to inspect the current goal state.

## End A Task

Before every task commit:

```bash
pnpm build
pnpm lint
pnpm test
pnpm theme:validate
pnpm check:contrast
pnpm check:imports
git status --short
```

Then:

```bash
git add .
git commit -m "<conventional commit title>"
git push origin main
```

## Rules

- One task equals one commit.
- Do not batch multiple completed tasks into one commit.
- Do not use `git commit --no-verify`.
- Do not use `git push --force`.
- If push is rejected, run `git pull --rebase origin main`, resolve conflicts, rerun verification, then push.

Commit body should explain why the change exists and include the verification commands that passed.
