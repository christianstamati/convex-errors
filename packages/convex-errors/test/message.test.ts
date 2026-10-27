import { ConvexError } from "convex/values";
import { expect, test } from "vite-plus/test";
import { errors } from "./errors";

const de = errors.translate({
  messages: {
    sign_in: () => "Melde dich zuerst an.",
    too_many: ({ what, max }) =>
      `Du kannst höchstens ${max} ${what === "bots" ? "Bots" : "Notizen"} haben.`,
  },
  fallback: "Etwas ist schiefgelaufen.",
});

const zod = new ConvexError({
  ZodError: [{ code: "too_small", message: "Name is too short.", path: ["name"] }],
});

test("returns the default message without a locale", () => {
  expect(errors.message(errors.create("too_many", { what: "bots", max: 5 }))).toBe(
    "You can have at most 5 bots.",
  );
});

test("translates an app error with its params", () => {
  expect(errors.message(errors.create("too_many", { what: "bots", max: 5 }), { locale: de })).toBe(
    "Du kannst höchstens 5 Bots haben.",
  );
});

test("uses the locale fallback for a bug", () => {
  expect(errors.message(new Error("x"), { locale: de })).toBe("Etwas ist schiefgelaufen.");
});

test("uses the locale fallback for a code the client doesn't know", () => {
  const e = new ConvexError({ code: "quota", params: {}, message: "Out of quota." });
  expect(errors.message(e, { locale: de })).toBe("Etwas ist schiefgelaufen.");
  expect(errors.message(e)).toBe("Out of quota.");
});

test("keeps the text of a string ConvexError", () => {
  expect(errors.message(new ConvexError("Bot not found."), { locale: de })).toBe("Bot not found.");
});

test("uses invalidArgs when the locale has it, and keeps the Zod message when it doesn't", () => {
  const withIssues = { ...de, invalidArgs: () => "Der Name ist zu kurz." };
  expect(errors.message(zod, { locale: withIssues })).toBe("Der Name ist zu kurz.");
  expect(errors.message(zod, { locale: de })).toBe("Name is too short.");
});

test("falls back when a message function throws", () => {
  const broken = errors.translate({
    ...de,
    messages: {
      ...de.messages,
      too_many: () => {
        throw new Error("param missing");
      },
    },
  });
  expect(
    errors.message(errors.create("too_many", { what: "bots", max: 5 }), { locale: broken }),
  ).toBe("Etwas ist schiefgelaufen.");
});

test("options.fallback wins over the locale fallback for a bug", () => {
  expect(
    errors.message(new Error("x"), { locale: de, fallback: "Speichern fehlgeschlagen." }),
  ).toBe("Speichern fehlgeschlagen.");
});
