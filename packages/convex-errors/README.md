<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/glow.svg?title=convex-errors&subtitle=Typed+errors+for+Convex,+from+throw+to+toast&logo=lu:ShieldAlert&theme=orange&mode=dark">
    <img alt="convex-errors: typed errors for Convex, from throw to toast" src="https://shieldcn.dev/header/glow.svg?title=convex-errors&subtitle=Typed+errors+for+Convex,+from+throw+to+toast&logo=lu:ShieldAlert&theme=orange&mode=light">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@cs-stack/convex-errors"><img alt="npm version" src="https://shieldcn.dev/npm/@cs-stack/convex-errors.svg"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://shieldcn.dev/npm/license/@cs-stack/convex-errors.svg"></a>
  <a href="https://github.com/christianstamati/convex-errors"><img alt="GitHub stars" src="https://shieldcn.dev/github/stars/christianstamati/convex-errors.svg"></a>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#declare-the-errors">Declare</a> ·
  <a href="#throw-them">Throw</a> ·
  <a href="#show-them">Show</a> ·
  <a href="#translate-them">Translate</a> ·
  <a href="#queries">Queries</a>
</p>

# @cs-stack/convex-errors

One consistent, typed way to define, throw, catch, show and translate errors in a Convex app.

- Declare every error code once, in a file the backend and frontend both import.
- A missing or wrong param, an unknown code, or a translation that skips a code fails the type check.
- One function turns any caught error into a message the user can read.
- Translation works with any library, or none.
- Move over one error at a time: old `new ConvexError("…")` strings still show their text.

### For LLMs and AI agents

- [llms.txt](https://raw.githubusercontent.com/christianstamati/convex-errors/main/packages/convex-errors/llms.txt): the whole API, which message is shown when, and type-checked recipes in one file
- [SKILL.md](https://raw.githubusercontent.com/christianstamati/convex-errors/main/packages/convex-errors/SKILL.md): an agent skill for adding the library to a Convex app

Both also ship in the npm package, as `node_modules/@cs-stack/convex-errors/llms.txt` and `SKILL.md`.

## Install

```sh
npm install @cs-stack/convex-errors
```

`convex` 1.3 or newer is the only peer dependency. ESM only, Node 18 or newer.

### Path aliases

The frontend samples below import `@convex/errors` instead of `../../convex/errors`. Add these paths to the frontend's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@convex/*": ["./convex/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

The paths are relative to the `tsconfig.json`, so `baseUrl` isn't needed. TypeScript 7 rejects it. Your bundler needs the same aliases. Vite doesn't read `paths` on its own, so add the `vite-tsconfig-paths` plugin or the same entries under `resolve.alias`. Files inside `convex/` keep importing each other with relative paths, like `./errors`.

## Declare the errors

Put them in `convex/errors.ts`. Each code maps to a function that returns its default message. The function's parameter is the code's params, which must be Convex values. The file has no server code, so the frontend can import it too.

```ts
import { defineErrors } from "@cs-stack/convex-errors";

export const errors = defineErrors({
  sign_in: () => "Sign in first.",
  not_found: (p: { what: "bot" | "reminder" | "chat" }) => `That ${p.what} doesn't exist anymore.`,
  too_many: (p: { what: "bots" | "notes"; max: number }) =>
    `You can have at most ${p.max} ${p.what}.`,
  file_too_large: (p: { maxMb: number }) => `Files can be at most ${p.maxMb} MB.`,
});
```

`invalid_args` and `unknown` are reserved.

### When Convex has its own package

In a monorepo where the Convex functions live in their own package, such as `packages/backend`, keep `errors.ts` in that package's `convex/` folder and export it:

```json
{
  "name": "@my-app/backend",
  "exports": { "./convex/errors": "./convex/errors.ts" }
}
```

The frontend imports the same errors from there:

```ts
import { errors } from "@my-app/backend/convex/errors";

export const toMessage = (error: unknown) => errors.message(error);
```

The frontend and backend packages can each resolve their own copy of `convex`. That's fine, because errors are recognised by name and shape, not only by `instanceof ConvexError`.

## Throw them

`errors.create(code, params)` returns a `ConvexError` to throw from a query, mutation or action. In `convex/bots.ts`:

```ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { errors } from "./errors";

const MAX_BOTS = 5;

export const createBot = mutation({
  args: { projectId: v.string(), name: v.string() },
  returns: v.id("bots"),
  handler: async (ctx, { projectId, name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw errors.create("sign_in");

    const bots = await ctx.db
      .query("bots")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .take(MAX_BOTS);
    if (bots.length >= MAX_BOTS) {
      throw errors.create("too_many", { what: "bots", max: MAX_BOTS });
    }
    return await ctx.db.insert("bots", { projectId, name });
  },
});
```

`errors.create("nope")` and `errors.create("not_found", { what: "robot" })` don't compile.

## Show them

`createAttempt` runs what a click started and reports a failure instead of losing it as an unhandled rejection. Create one `attempt` for the app and plug in any toast. With sonner, in `src/lib/attempt.ts`:

```ts
import { createAttempt } from "@cs-stack/convex-errors";
import { toast } from "sonner";
import { errors } from "@convex/errors";

export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });
```

`attempt` resolves to `true` when the work succeeds and `false` when it fails, and it never rejects. Use the result for what should only happen on success. Every failure shows a toast. An app error shows its own message. The second argument is the message for anything else, such as a bug or a network failure:

```ts
import { attempt } from "@/lib/attempt";

export const saveNote = async (save: () => Promise<null>, close: () => void) => {
  if (await attempt(save(), "Couldn't save the note.")) close();
};
```

Without the second argument, that message is the locale's `fallback`, or "Something went wrong. Try again."

To use the mutation's result, chain it into the promise you pass, so a failure there is reported the same way:

```ts
import { attempt } from "@/lib/attempt";

export const createAndOpen = (createBot: () => Promise<string>, navigate: (id: string) => void) =>
  attempt(createBot().then((id) => navigate(id)));
```

The raw error goes to `console.error`, or to `log` if you pass one. Write your own `try`/`catch` only when one error needs something other than a toast, and use `errors.is` there (see below).

Without `createAttempt`, `errors.message(error)` gives the text for any caught error. It never throws.

## Translate them

`errors.translate` checks a locale against the codes and their params. Leaving a code out, or reading a param that doesn't exist, fails the type check.

With a plain object, in `src/lib/de.ts`:

```ts
import { errors } from "@convex/errors";

export const de = errors.translate({
  messages: {
    sign_in: () => "Melde dich zuerst an.",
    not_found: ({ what }) =>
      `${{ bot: "Dieser Bot", reminder: "Diese Erinnerung", chat: "Dieser Chat" }[what]} existiert nicht mehr.`,
    too_many: ({ what, max }) =>
      `Du kannst höchstens ${max} ${what === "bots" ? "Bots" : "Notizen"} haben.`,
    file_too_large: ({ maxMb }) => `Dateien dürfen höchstens ${maxMb} MB groß sein.`,
  },
  fallback: "Etwas ist schiefgelaufen.",
});
```

With Paraglide, call its message functions:

```ts
import { errors } from "@convex/errors";
import { m } from "@/paraglide/messages.js";

export const locale = errors.translate({
  messages: {
    sign_in: () => m.sign_in(),
    not_found: (params) => m.not_found(params),
    too_many: (params) => m.too_many(params),
    file_too_large: (params) => m.file_too_large(params),
  },
  fallback: m.something_went_wrong(),
});
```

[`examples/paraglide`](../../examples/paraglide) in this repo is a working TanStack Start app translated this way.

Pass the locale to `errors.message(error, { locale })`, or give `createAttempt` a `locale` function. It's called on each failure, so the toast follows the current language. In `src/lib/attempt.ts`:

```ts
import { createAttempt } from "@cs-stack/convex-errors";
import { toast } from "sonner";
import { errors } from "@convex/errors";
import { de } from "@/lib/de";

export const attempt = createAttempt(errors, {
  onError: (message) => toast.error(message),
  locale: () => (document.documentElement.lang === "de" ? de : undefined),
});
```

The second argument to `attempt` skips translation, so pass a translated string there, like `m.couldnt_save_note()`.

A locale can also set `invalidArgs: (issues) => "…"` to word Zod validation errors in its language. When a locale is passed, a code the client doesn't know (sent by a newer server) shows `locale.fallback` instead of the server's English.

## Branch on one error

`errors.is` narrows the error, so its params are typed:

```ts
import { errors } from "@convex/errors";

export const onCreateBotError = (error: unknown) => {
  if (errors.is(error, "too_many")) {
    const { max } = error.data.params; // typed: { what: "bots" | "notes"; max: number }
    return `Upgrade to have more than ${max} bots.`;
  }
  return errors.message(error);
};
```

## Moving over from string errors

`new ConvexError("Bot not found.")` keeps working: `errors.message` shows its text. Convert them one at a time.

## Queries

`createAttempt` is for mutations and actions. For queries, `useQuery` from `convex-helpers/react` returns the error instead of throwing it:

```ts
import { useQuery } from "convex-helpers/react";
import { api } from "@convex/_generated/api";
import { errors } from "@convex/errors";

export const useBotsError = () => {
  const result = useQuery(api.bots.list);
  return result.status === "error" ? errors.message(result.error) : undefined;
};
```

## Wire format

`ConvexError.data` is exactly `{ code, params, message }`:

```json
{ "code": "not_found", "params": { "what": "bot" }, "message": "That bot doesn't exist anymore." }
```

`params` is left out for a code without params. `message` is the default English text, so logs and older clients can still read it. Validation errors from convex-helpers' `zCustomMutation`, which send `{ ZodError: issues }`, are parsed as `invalid_args`.

The samples above are type-checked in [`example/`](./example), laid out like an app with `convex/` and `src/`. In this repo, `bun run example` runs each kind of error through the client side.
