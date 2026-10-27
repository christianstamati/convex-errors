# Paraglide example

The minimal notes app on TanStack Start, in English and Italian with
[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs).

```
messages/en.json, it.json  The texts, including each error code's message
src/lib/errors.ts          errorMessage: errors.message with a locale built from Paraglide's m
src/server.ts              Renders each request in the language from its cookie
convex/errors.ts           The error codes, with their default English messages
```

The buttons call Paraglide's `setLocale`, which stores the language in a cookie and reloads the
page. Run it from the repo root with `bun run dev:paraglide`.
