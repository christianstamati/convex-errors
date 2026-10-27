// Runs each kind of failure through the client side, as a mutation's rejection would arrive.
import { createAttempt } from "@cs-stack/convex-errors";
import { ConvexError } from "convex/values";
import { errors } from "./convex/errors";
import { onCreateBotError } from "./src/bots";
import { de } from "./src/lib/de";

let locale: "en" | "de" = "en";
// Like src/lib/attempt.ts, with console.log for the toast so the demo runs in a terminal.
const attempt = createAttempt(errors, {
  onError: (message) => console.log(`  toast: ${message}`),
  locale: () => (locale === "de" ? de : undefined),
  log: () => {}, // keep the demo output short
});

const failing = (error: unknown) => Promise.reject(error);

const cases: [string, unknown][] = [
  ["app error with params", errors.create("too_many", { what: "bots", max: 5 })],
  ["app error, no params", errors.create("sign_in")],
  [
    "zod validation (zCustomMutation)",
    new ConvexError({
      ZodError: [{ code: "too_small", message: "Name is too short.", path: ["name"] }],
    }),
  ],
  ["old-style string ConvexError", new ConvexError("Bot not found.")],
  [
    "code from a newer server",
    new ConvexError({ code: "quota", params: {}, message: "Out of quota." }),
  ],
  ["a bug (plain Error)", new Error("Cannot read properties of undefined")],
];

for (const next of ["en", "de"] as const) {
  locale = next;
  console.log(`\n== ${locale} ==`);
  for (const [name, error] of cases) {
    console.log(name);
    await attempt(failing(error));
  }
}

console.log("\n== branching with errors.is ==");
console.log(" ", onCreateBotError(errors.create("too_many", { what: "bots", max: 5 })));
console.log(" ", onCreateBotError(errors.create("sign_in")));

console.log("\n== what goes over the wire ==");
console.log(" ", JSON.stringify(errors.create("not_found", { what: "bot" }).data));
