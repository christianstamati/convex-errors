---
name: convex-errors
description: Add typed, translatable error codes to a Convex app with @cs-stack/convex-errors, or work in an app that already uses it. Use when declaring, throwing, catching, showing or translating errors in Convex functions or their frontend, when replacing `throw new Error` or string `ConvexError`s, or when a mutation's error should become a toast.
---

# convex-errors

The full API, the message rules and type-checked recipes are in
[llms.txt](https://raw.githubusercontent.com/christianstamati/convex-errors/main/packages/convex-errors/llms.txt).
Read it before writing code with this library.

## Add it to an app

1. Install: `npm install @cs-stack/convex-errors`. It needs `convex` 1.3 or newer.
2. Add `"@convex/*": ["./convex/*"]` and `"@/*": ["./src/*"]` to `compilerOptions.paths` in the
   frontend's `tsconfig.json`, without `baseUrl`. Give the bundler the same aliases, for example
   with `vite-tsconfig-paths`.
3. Create `convex/errors.ts` with `defineErrors`. One code per thing the user can get wrong, each
   returning its default English message. Params are objects of Convex values.
4. In Convex functions, replace `throw new Error("…")` and `throw new ConvexError("…")` for
   user-facing errors with `throw errors.create(code, params)`. Old string `ConvexError`s keep
   showing their text, so convert them one at a time.
5. Create `src/lib/attempt.ts` with `createAttempt(errors, { onError })`, wired to the app's toast.
6. In event handlers, replace `try`/`catch` around mutations and actions with
   `if (await attempt(mutation(args), "Couldn't …")) onSuccess()`.
7. If the app is translated, build a locale with `errors.translate` and pass `locale` to
   `createAttempt`. Pass translated strings as `attempt`'s second argument.

## Check your work

- The type check fails on an unknown code, a missing or wrong param, or a locale that skips a
  code. Run it after each change.
- Don't define the reserved codes `invalid_args` or `unknown`.
- Don't wrap `attempt` in `try`/`catch`. It never rejects.
- Files in `convex/` import `./errors` with a relative path. Only frontend files use `@convex/errors`.
- For queries, use `useQuery` from `convex-helpers/react` and `errors.message(result.error)`.
