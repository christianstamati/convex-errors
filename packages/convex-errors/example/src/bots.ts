import { errors } from "../convex/errors";

export const onCreateBotError = (error: unknown) => {
  if (errors.is(error, "too_many")) {
    const { max } = error.data.params; // typed: { what: "bots" | "notes"; max: number }
    return `Upgrade to have more than ${max} bots.`;
  }
  return errors.message(error);
};
