import { defineErrors } from "../src/index";

export const errors = defineErrors({
  sign_in: () => "Sign in first.",
  too_many: (p: { what: "bots" | "notes"; max: number }) =>
    `You can have at most ${p.max} ${p.what}.`,
});
