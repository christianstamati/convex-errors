import { defineConfig } from "vite-plus";

// Generated files and build output: never formatted or linted.
const IGNORED = [
  "**/routeTree.gen.ts",
  "**/convex/_generated/**",
  "**/.output/**",
  "**/.wrangler/**",
  "**/dist/**",
];

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: IGNORED,
  },
  lint: {
    ignorePatterns: IGNORED,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
