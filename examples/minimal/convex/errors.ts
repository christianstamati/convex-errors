import { defineErrors } from "convex-errors";

export const errors = defineErrors({
  note_length: (p: { max: number }) => `A note must be 1 to ${p.max} characters.`,
});
