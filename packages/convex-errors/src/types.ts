import type { Value } from "convex/values";

/** Each code's default message. Its parameter, if any, is the code's params. */
export type Definitions = Record<string, (params: never) => string>;

export type ParamsOf<F extends (params: never) => string> = Parameters<F>[0];

/** Codes the library uses itself, so an app can't define them. */
export type ReservedCode = "invalid_args" | "unknown";

/**
 * Rejects a definition whose params aren't Convex values (they cross the wire),
 * or whose code is reserved.
 */
export type Checked<D extends Definitions> = {
  [C in keyof D]: C extends ReservedCode
    ? `"${C}" is a reserved code`
    : ParamsOf<D[C]> extends Record<string, Value> | undefined
      ? D[C]
      : "params must be an object of Convex values";
};

/** What a thrown app error carries in `ConvexError.data`. */
export type ErrorData<D extends Definitions, C extends keyof D = keyof D> = {
  [K in C & string]: { code: K; params: ParamsOf<D[K]>; message: string };
}[C & string];

/** A Zod issue as convex-helpers' `zCustomMutation` sends it. */
export type Issue = { code: string; message: string; path: (string | number)[] };

/** Any caught error, sorted into one of three shapes. */
export type InvalidArgsError = { code: "invalid_args"; issues: Issue[]; message: string };
export type UnknownError = { code: "unknown"; message: string; error: unknown };
export type ParsedError<D extends Definitions> = ErrorData<D> | InvalidArgsError | UnknownError;

/** A full set of messages for one language: every code, with the same params. */
export type Messages<D extends Definitions> = { [C in keyof D]: D[C] };

/** One language: every code's message, a fallback, and optionally Zod issues in that language. */
export type Locale<D extends Definitions> = {
  messages: Messages<D>;
  fallback: string;
  invalidArgs?: (issues: Issue[]) => string;
};
