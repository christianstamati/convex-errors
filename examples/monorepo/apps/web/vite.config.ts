import { fileURLToPath } from "node:url";
import { defaultClientConditions, defineConfig, loadEnv } from "vite-plus";
import react from "@vitejs/plugin-react";

// `convex dev` writes the deployment URL to the backend package's .env.local.
const backend = fileURLToPath(new URL("../../packages/backend", import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use convex-errors from its source in this repo. Convex's own bundler can't take extra
  // conditions, so the backend's functions use the built dist/ (`bun run dev` keeps it fresh).
  resolve: { conditions: ["@convex-errors/source", ...defaultClientConditions] },
  define: {
    "import.meta.env.VITE_CONVEX_URL": JSON.stringify(loadEnv(mode, backend, "CONVEX_").CONVEX_URL),
  },
}));
