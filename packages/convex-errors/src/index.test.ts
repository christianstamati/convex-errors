import { ConvexError } from "convex/values";
import { expect, test } from "vite-plus/test";
import { errorMessage } from "./index";

test("uses the message of a ConvexError", () => {
  expect(errorMessage(new ConvexError("Nope"), "Failed")).toBe("Nope");
});

test("falls back for any other error", () => {
  expect(errorMessage(new Error("boom"), "Failed")).toBe("Failed");
  expect(errorMessage(new ConvexError({ code: 1 }), "Failed")).toBe("Failed");
});
