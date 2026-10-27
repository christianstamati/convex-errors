// The app's errors, declared once. The web app imports them from this package.
import { defineErrors } from "convex-errors";

export const errors = defineErrors({
  note_length: (p: { max: number }) => `A note must be 1 to ${p.max} characters.`,
  note_not_found: () => "That note doesn't exist anymore.",
});
