import { ConvexError } from "convex/values";
import { expect, test } from "vite-plus/test";
import { errors } from "./errors";

test("parses an app error", () => {
  const e = errors.create("too_many", { what: "bots", max: 5 });
  expect(errors.parse(e)).toEqual(e.data);
});

test("parses a convex-helpers Zod error", () => {
  const issues = [{ code: "too_small", message: "Name is too short.", path: ["name"] }];
  expect(errors.parse(new ConvexError({ ZodError: issues }))).toEqual({
    code: "invalid_args",
    message: "Name is too short.",
    issues,
  });
});

test("uses the fallback for an empty ZodError", () => {
  expect(errors.parse(new ConvexError({ ZodError: [] })).message).toBe(
    "Something went wrong. Try again.",
  );
});

test("keeps the text of a string ConvexError", () => {
  expect(errors.parse(new ConvexError("Bot not found."))).toMatchObject({
    code: "unknown",
    message: "Bot not found.",
  });
});

test("parses an unknown code with the server message", () => {
  const e = new ConvexError({ code: "quota", params: {}, message: "Out of quota." });
  expect(errors.parse(e)).toMatchObject({ code: "quota", message: "Out of quota." });
});

test("uses the fallback for a plain Error", () => {
  expect(errors.parse(new Error("x"), "Oops")).toMatchObject({ code: "unknown", message: "Oops" });
});

test("parses a ConvexError from another copy of convex", () => {
  const other = Object.assign(new Error("ConvexError"), {
    name: "ConvexError",
    data: { code: "sign_in", params: undefined, message: "Sign in first." },
  });
  expect(errors.parse(other)).toMatchObject({ code: "sign_in" });
  expect(errors.is(other, "sign_in")).toBe(true);
});
