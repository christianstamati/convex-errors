import { ConvexError } from "convex/values";
import type { Value } from "convex/values";
import type { ErrorData, Issue, ParsedError, Definitions } from "./types.js";

export const DEFAULT_FALLBACK = "Something went wrong. Try again.";

const isObject = (data: unknown): data is Record<string, unknown> =>
  typeof data === "object" && data !== null;

/** Also accepts a `ConvexError` from another copy of `convex` in the same bundle. */
export const isConvexError = (error: unknown): error is ConvexError<Value> =>
  error instanceof ConvexError ||
  (error instanceof Error && error.name === "ConvexError" && "data" in error);

/** Sorts any thrown value into an app error, a validation error or an unknown one. */
export const parseError = <D extends Definitions>(
  error: unknown,
  fallback = DEFAULT_FALLBACK,
): ParsedError<D> => {
  if (!isConvexError(error)) return { code: "unknown", message: fallback, error };
  const data: unknown = error.data;
  if (isObject(data) && Array.isArray(data.ZodError)) {
    const issues = data.ZodError as Issue[];
    return { code: "invalid_args", issues, message: issues[0]?.message ?? fallback };
  }
  if (isObject(data) && typeof data.code === "string" && typeof data.message === "string") {
    // A code this client doesn't know (a newer server) still has the server's message.
    return data as ErrorData<D>;
  }
  // A plain `new ConvexError('…')` from code that hasn't moved to codes yet.
  if (typeof data === "string") return { code: "unknown", message: data, error };
  return { code: "unknown", message: fallback, error };
};
