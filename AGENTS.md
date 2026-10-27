# AGENTS.md

Notes for coding agents working in this repo. Read this before changing anything.

This repo is for building the `convex-errors` library. The examples only exist to try it.

## Layout

```
packages/convex-errors/  The library: src/, tests in test/, README samples in example/
examples/minimal/        Plain Vite + React app that uses the library
  convex/                Its Convex functions in models/<table>/, made public in api/, and schema.
                         _generated/ is committed, never edit it
                         (_generated/ai/ holds Convex's guidelines.md for agents)
examples/paraglide/      The minimal app on TanStack Start, translated with Paraglide (en, it).
                         src/paraglide/ is compiled by `bun install` (prepare) and not committed
convex.json              Points the Convex CLI at examples/minimal/convex/ when run from the root
.agents/skills/          Convex agent skills from `convex ai-files install`, also in .claude/skills/
```

Examples depend on `convex-errors` as a workspace package. Its `exports` point at `dist/`, which
is what gets published. TypeScript and Vite in an example read `src/` instead, through the
`@convex-errors/source` condition. Convex's bundler can't take extra conditions, so an example's
`convex/` functions use `dist/`, and `bun run dev` builds it and keeps it fresh.

## Commands

Run everything from the repo root with Bun.

| Command                 | What it does                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| `bun install`           | Install dependencies and the Vite+ git hooks                            |
| `bun run dev`           | Local Convex deployment and examples/minimal on http://localhost:5173   |
| `bun run dev:paraglide` | Local Convex deployment and examples/paraglide on http://localhost:5175 |
| `bun run check`         | Format, lint and type check (`vp check`). Fix with `vp check --fix`     |
| `bun run test`          | Library unit tests (Vitest via `vp test`)                               |
| `bun run build`         | Build the library (dist/) and the examples                              |

The pre-commit hook runs `vp check --fix` on staged files. Don't skip it with `--no-verify`.

## Rules

- Tooling is Vite+. Import test helpers from `vite-plus/test` and config helpers from
  `vite-plus`, not `vitest` or `vite`. The `vite-plus/prefer-vite-plus-imports` lint rule
  enforces this.
- Each app and package has its own standalone tsconfig.json that includes only its own files.
  The root tsconfig.json covers only `vite.config.ts`.
- Env vars a Convex function needs must be set with `bunx convex env set` in the example's
  Convex folder: examples/minimal or examples/paraglide.
- The Convex agent skills, `skills-lock.json` and `examples/minimal/convex/_generated/ai/` come from
  `npx convex ai-files install`. Don't edit them by hand; `vp check` skips the skills.

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`examples/minimal/convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
