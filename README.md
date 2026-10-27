# convex-errors

A library for errors in Convex apps.

```
packages/convex-errors/   the library
examples/minimal/         a Vite + React app with its Convex functions in convex/
examples/monorepo/        the same app as a monorepo: apps/web and Convex in packages/backend
examples/paraglide/       the same app on TanStack Start, in English and Italian with Paraglide
```

## Develop

You need Bun 1.4 and Node 24. No Convex account is needed: `convex dev` offers a local deployment.

```sh
bun install
bun run dev            # examples/minimal on http://localhost:5173
bun run dev:monorepo   # examples/monorepo on http://localhost:5174
bun run dev:paraglide  # examples/paraglide on http://localhost:5175
bun run test           # library tests
bun run check          # format, lint, type check
```
