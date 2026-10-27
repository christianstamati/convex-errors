import { errors } from "../../convex/errors";
import { m } from "../paraglide/messages.js";

/** The text for any caught error, in the current language. */
export const errorMessage = (error: unknown) =>
  errors.message(error, {
    locale: errors.translate({
      messages: { note_length: (params) => m.note_length(params) },
      fallback: m.something_went_wrong(),
    }),
  });
