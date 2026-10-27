import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // Convex functions run in an edge-like runtime; convex-test relies on it.
    environment: "edge-runtime",
    include: ["convex/**/*.test.ts"],
    server: { deps: { inline: ["convex-test"] } },
  },
});
