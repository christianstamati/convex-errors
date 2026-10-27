import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // convex-test runs Convex functions in an edge-like runtime.
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    typecheck: { enabled: true },
  },
});
