// Runs each kind of failure through the client side, as a mutation's rejection would arrive.
import { ConvexError } from "convex/values";
import { attempt, onCreateBotError, setLocale } from "./client";
import { errors } from "./errors";

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

const originalError = console.error;
console.error = () => {}; // attempt() logs the raw error; keep the demo output short

for (const locale of ["en", "de"] as const) {
  setLocale(locale);
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
console.error = originalError;
