import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defaultClientConditions, defaultServerConditions, defineConfig } from "vite-plus";

// Use convex-errors from its source in this repo. Convex's own bundler can't take extra
// conditions, so the functions in convex/ use the built dist/ (`bun run dev` keeps it fresh).
const source = "@convex-errors/source";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      // The language is kept in a cookie; there are no /it/... URLs.
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
    }),
    tanstackStart(),
    react(),
  ],
  resolve: { conditions: [source, ...defaultClientConditions] },
  ssr: { resolve: { conditions: [source, ...defaultServerConditions] } },
});
