import { expectTypeOf, test } from "vite-plus/test";
import { defineErrors } from "../src/index";
import { errors } from "./errors";

test("rejects missing params", () => {
  // @ts-expect-error params are required
  errors.create("too_many");
});

test("rejects a wrong param value", () => {
  // @ts-expect-error 'robots' is not allowed
  errors.create("too_many", { what: "robots", max: 5 });
});

test("rejects an unknown code", () => {
  // @ts-expect-error no such code
  errors.create("nope");
});

test("rejects params for a code without them", () => {
  // @ts-expect-error sign_in takes no params
  errors.create("sign_in", { x: 1 });
});

test("rejects params that are not Convex values", () => {
  // @ts-expect-error Date is not a Convex value
  defineErrors({ bad: (p: { when: Date }) => String(p.when) });
});

test("rejects reserved codes", () => {
  // @ts-expect-error reserved
  defineErrors({ unknown: () => "" });
  // @ts-expect-error reserved
  defineErrors({ invalid_args: () => "" });
});

test("rejects a locale missing a code", () => {
  // @ts-expect-error too_many is missing
  errors.translate({ messages: { sign_in: () => "" }, fallback: "" });
});

test("rejects a translation reading a param that doesn't exist", () => {
  errors.translate({
    messages: {
      sign_in: () => "",
      // @ts-expect-error `nope` is not a param of too_many
      too_many: ({ nope }) => nope,
    },
    fallback: "",
  });
});

test("is narrows params", () => {
  const e: unknown = null;
  if (errors.is(e, "too_many")) {
    expectTypeOf(e.data.params.max).toEqualTypeOf<number>();
  }
});
