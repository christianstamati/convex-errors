import { ConvexError } from "convex/values";
import { expect, test } from "vite-plus/test";
import { errors } from "./errors";

test("create returns a ConvexError with code, params and default message", () => {
  const e = errors.create("too_many", { what: "bots", max: 5 });
  expect(e).toBeInstanceOf(ConvexError);
  expect(e.data).toEqual({
    code: "too_many",
    params: { what: "bots", max: 5 },
    message: "You can have at most 5 bots.",
  });
});

test("create works for a code without params", () => {
  expect(errors.create("sign_in").data).toEqual({
    code: "sign_in",
    params: undefined,
    message: "Sign in first.",
  });
});

test("is matches its code", () => {
  expect(errors.is(errors.create("too_many", { what: "bots", max: 5 }), "too_many")).toBe(true);
});

test("is rejects other codes and plain errors", () => {
  expect(errors.is(errors.create("sign_in"), "too_many")).toBe(false);
  expect(errors.is(new Error(), "sign_in")).toBe(false);
  expect(errors.is(null, "sign_in")).toBe(false);
  expect(errors.is(new ConvexError("Bot not found."), "sign_in")).toBe(false);
});
