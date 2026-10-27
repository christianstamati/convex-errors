import { defaultClientConditions, defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use convex-errors from its source in this repo. Convex's own bundler can't take extra
  // conditions, so the functions in convex/ use the built dist/ (`bun run dev` keeps it fresh).
  resolve: { conditions: ["@convex-errors/source", ...defaultClientConditions] },
});
