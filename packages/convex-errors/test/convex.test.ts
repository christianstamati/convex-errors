import { convexTest } from "convex-test";
import { makeFunctionReference } from "convex/server";
import { expect, test } from "vite-plus/test";
import { errors } from "./convex/errors";
import schema from "./convex/schema";

const createBot = makeFunctionReference<"mutation", { name: string }>("bots:createBot");
const rename = makeFunctionReference<"mutation", { name: string }>("bots:rename");
const modules = import.meta.glob("./convex/**/*.ts");

test("an app error survives a mutation", async () => {
  const t = convexTest(schema, modules);
  await t.mutation(createBot, { name: "a" });
  await t.mutation(createBot, { name: "b" });
  const e = await t.mutation(createBot, { name: "c" }).catch((error: unknown) => error);
  expect(errors.is(e, "too_many")).toBe(true);
  expect(errors.message(e)).toBe("You can have at most 2 bots.");
});

test("a Zod error survives a mutation", async () => {
  const t = convexTest(schema, modules);
  const e = await t.mutation(rename, { name: "x" }).catch((error: unknown) => error);
  expect(errors.parse(e).code).toBe("invalid_args");
});
