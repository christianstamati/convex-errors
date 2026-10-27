# AGENTS.md

Notes for coding agents working in this repo. Read this before changing anything.

This repo is for building the `convex-errors` library. The demo app only exists to try it.

## Layout

```
packages/convex-errors/  The library: src/index.ts, tests next to the code
apps/demo/               Plain Vite + React app that uses the library
  convex/                Its Convex functions and schema. _generated/ is committed, never edit it
                         (_generated/ai/ holds Convex's guidelines.md for agents)
convex.json              Points the Convex CLI at apps/demo/convex/ when run from the root
.agents/skills/          Convex agent skills from `convex ai-files install`, also in .claude/skills/
```

The demo imports the library as `convex-errors` (a workspace package, used straight from `src/`, no build).

## Commands

Run everything from the repo root with Bun.

| Command         | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `bun install`   | Install dependencies and the Vite+ git hooks                        |
| `bun run dev`   | Local Convex deployment and the demo on http://localhost:5173       |
| `bun run check` | Format, lint and type check (`vp check`). Fix with `vp check --fix` |
| `bun run test`  | Library unit tests (Vitest via `vp test`)                           |
| `bun run build` | Production build of the demo                                        |

The pre-commit hook runs `vp check --fix` on staged files. Don't skip it with `--no-verify`.

## Rules

- Tooling is Vite+. Import test helpers from `vite-plus/test` and config helpers from
  `vite-plus`, not `vitest` or `vite`. The `vite-plus/prefer-vite-plus-imports` lint rule
  enforces this.
- Each app and package has its own standalone tsconfig.json that includes only its own files.
  The root tsconfig.json covers only `vite.config.ts`.
- Env vars a Convex function needs must be set with `bunx convex env set` in apps/demo.
- The Convex agent skills, `skills-lock.json` and `apps/demo/convex/_generated/ai/` come from
  `npx convex ai-files install`. Don't edit them by hand; `vp check` skips the skills.

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`apps/demo/convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
