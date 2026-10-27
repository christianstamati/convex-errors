import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  clean: true,
  // tsc writes the declarations: TypeScript 7 has no API for tsdown to call.
  dts: false,
  outExtensions: () => ({ js: ".js" }),
});
