// @vitest-environment node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

// Every TypeScript sample in the README is copied from example/, which is type-checked.
const root = join(import.meta.dirname, "..");
const examples = readdirSync(join(root, "example"), { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".ts"))
  .map((file) => readFileSync(join(root, "example", file), "utf8"))
  .join("\n");
const samples = [
  ...readFileSync(join(root, "README.md"), "utf8").matchAll(/```ts\n([\s\S]*?)```/g),
];

test.each(samples.map((match) => [match[1]!.split("\n")[0], match[1]!]))(
  "README sample is in example/: %s",
  (_first, sample) => {
    expect(examples).toContain(sample.trim());
  },
);
