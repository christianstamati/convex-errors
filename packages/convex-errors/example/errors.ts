// The app's errors, declared once. Lives in convex/errors.ts so both the
// backend and the frontend import it. It has no server code.
import { defineErrors } from "convex-errors";

export const errors = defineErrors({
  sign_in: () => "Sign in first.",
  not_found: (p: { what: "bot" | "reminder" | "chat" }) => `That ${p.what} doesn't exist anymore.`,
  too_many: (p: { what: "bots" | "notes"; max: number }) =>
    `You can have at most ${p.max} ${p.what}.`,
  file_too_large: (p: { maxMb: number }) => `Files can be at most ${p.maxMb} MB.`,
});
