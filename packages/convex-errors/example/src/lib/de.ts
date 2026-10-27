import { errors } from "@convex/errors";

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
