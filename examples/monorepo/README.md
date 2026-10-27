# Monorepo example

A notes app with its Convex functions in their own package. The backend follows
[ianmacartney/code-organization-pattern](https://github.com/ianmacartney/code-organization-pattern):

```
apps/web/            Vite + React
  src/lib/api.ts     The public Convex API, from @monorepo/backend/convex/_generated/api
  src/lib/attempt.ts createAttempt with the backend's errors and a sonner toast
packages/backend/    Convex
  convex/errors.ts   The app's errors, exported as @monorepo/backend/convex/errors
  convex/models/     Each table's functions
  convex/api/        The functions that make up the public API
```

The backend package exports `convex/errors.ts`, so the web app shows the same codes the
functions throw. Run it from the repo root with `bun run dev:monorepo`.
