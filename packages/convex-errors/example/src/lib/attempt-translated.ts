// src/lib/attempt.ts once the app has a second language.
import { createAttempt } from "@cs-stack/convex-errors";
import { toast } from "sonner";
import { errors } from "@convex/errors";
import { de } from "@/lib/de";

export const attempt = createAttempt(errors, {
  onError: (message) => toast.error(message),
  locale: () => (document.documentElement.lang === "de" ? de : undefined),
});
