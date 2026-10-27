import { ConvexError } from "convex/values";

/** The message to show when a mutation fails: a `ConvexError` message, or `fallback` for anything else. */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ConvexError && typeof error.data === "string" ? error.data : fallback;
}
