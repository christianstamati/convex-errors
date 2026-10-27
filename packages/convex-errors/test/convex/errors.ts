import { defineErrors } from "../../src/index";

export const errors = defineErrors({
  too_many: (p: { what: "bots"; max: number }) => `You can have at most ${p.max} ${p.what}.`,
});
