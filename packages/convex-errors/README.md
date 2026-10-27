# convex-errors

One consistent, typed way to define, throw, catch, show and translate errors in a Convex app.

- Declare every error code once, in a file the backend and frontend both import.
- A missing or wrong param, an unknown code, or a translation that skips a code fails the type check.
- One function turns any caught error into a message the user can read.
- Translation works with any library (or none).
- Move over one error at a time: old `new ConvexError('…')` strings still show their text.

## Install

```sh
npm install convex-errors
```

`convex` (1.3 or newer) is the only peer dependency. ESM only, Node 18 or newer.

## Declare the errors

Put them in `convex/errors.ts`. Each code maps to a function that returns its default message. The function's parameter is the code's params, which must be Convex values.

```ts
import { defineErrors } from "convex-errors";

export const errors = defineErrors({
  sign_in: () => "Sign in first.",
  not_found: (p: { what: "bot" | "reminder" | "chat" }) => `That ${p.what} doesn't exist anymore.`,
  too_many: (p: { what: "bots" | "notes"; max: number }) =>
    `You can have at most ${p.max} ${p.what}.`,
});
```

`invalid_args` and `unknown` are reserved.

## Throw them

```ts
if (!identity) throw errors.create("sign_in");
if (bots.length >= MAX_BOTS) throw errors.create("too_many", { what: "bots", max: MAX_BOTS });
```

## Show them

`createAttempt` runs what a click started and reports a failure instead of losing it as an unhandled rejection. Plug in any toast:

```ts
import { toast } from "sonner";
import { createAttempt } from "convex-errors";
import { errors } from "../convex/errors";

export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });

// await attempt(createBot({ name }), "Could not create the bot.");
```

Without `createAttempt`, `errors.message(error)` gives the text for any caught error and never throws.

## Translate them

`errors.translate` checks a locale against the codes and their params. Leaving a code out, or reading a param that doesn't exist, fails the type check.

```ts
export const de = errors.translate({
  messages: {
    sign_in: () => "Melde dich zuerst an.",
    not_found: ({ what }) => `${what} existiert nicht mehr.`,
    too_many: ({ what, max }) => `Du kannst höchstens ${max} ${what} haben.`,
  },
  fallback: "Etwas ist schiefgelaufen.",
  // invalidArgs: (issues) => "…", optional: rewrite Zod issues
});

errors.message(error, { locale: de });
```

With a plain object, pick the locale in `createAttempt`: `locale: () => (lang === "de" ? de : undefined)`. With a translation library such as Paraglide, call its message functions inside each entry: `sign_in: () => m.sign_in()`.

When a locale is passed, a code the client doesn't know (from a newer server) shows `locale.fallback`, not the server's English.

## Branch on one error

```ts
if (errors.is(error, "too_many")) {
  const { max } = error.data.params; // typed: { what: 'bots' | 'notes'; max: number }
}
```

## Moving over from string errors

`new ConvexError("Bot not found.")` keeps working: `errors.message` shows its text. Convert them one at a time.

## Queries

`createAttempt` is for mutations and actions. For queries, use `useQuery` from `convex-helpers/react`, which returns `{ status, error }`, and pass `error` to `errors.message`.

## Wire format

`ConvexError.data` is exactly `{ code: string, params?: object, message: string }`. `message` is the default English text, so logs and older clients can still read it. Validation errors from `convex-helpers`' `zCustomMutation` (`{ ZodError: issues }`) are recognised too and parsed as `invalid_args`.

The runnable version of these samples is in [`example/`](./example).
