import { errors } from "@convex/errors";
import { m } from "@/paraglide/messages.js";

export const locale = errors.translate({
  messages: {
    sign_in: () => m.sign_in(),
    not_found: (params) => m.not_found(params),
    too_many: (params) => m.too_many(params),
    file_too_large: (params) => m.file_too_large(params),
  },
  fallback: m.something_went_wrong(),
});
