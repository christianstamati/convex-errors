// The frontend: src/lib/errors.ts and a component, without React so the spike runs anywhere.
import { createAttempt } from "../src/index";
import { errors } from "./errors";

// German messages. Leaving out a code, or reading a param that doesn't exist, fails the type check.
export const de = errors.translate({
  messages: {
    sign_in: () => "Melde dich zuerst an.",
    not_found: ({ what }) =>
      `${{ bot: "Dieser Bot", reminder: "Diese Erinnerung", chat: "Dieser Chat" }[what]} existiert nicht mehr.`,
    too_many: ({ what, max }) =>
      `Du kannst höchstens ${max} ${what === "bots" ? "Bots" : "Notizen"} haben.`,
    file_too_large: ({ maxMb }) => `Dateien dürfen höchstens ${maxMb} MB groß sein.`,
  },
  fallback: "Etwas ist schiefgelaufen.",
});

let locale: "en" | "de" = "en";
export const setLocale = (next: "en" | "de") => {
  locale = next;
};

// Once per app. Swap console.log for sonner's toast.error, or anything else.
export const attempt = createAttempt(errors, {
  onError: (message) => console.log(`  toast: ${message}`),
  locale: () => (locale === "de" ? de : undefined),
});

// Branching on one error, e.g. to offer an upgrade instead of a toast.
export const onCreateBotError = (error: unknown) => {
  if (errors.is(error, "too_many")) {
    const { max } = error.data.params; // typed: { what: 'bots' | 'notes'; max: number }
    return `Upgrade to have more than ${max} bots.`;
  }
  return errors.message(error);
};
