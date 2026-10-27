import { defineConfig } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { lazyPlugins } from "vite-plus";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // Vitest unit tests live next to the code they test.
  test: { exclude: ["node_modules/**"], passWithNoTests: true },
  // Unit tests only need React; the Start, Cloudflare and devtools plugins expect a dev server or build.
  plugins: lazyPlugins(() =>
    process.env.VITEST
      ? [viteReact()]
      : [
          devtools(),
          cloudflare({ viteEnvironment: { name: "ssr" } }),
          tailwindcss(),
          tanstackStart(),
          viteReact(),
        ],
  ),
});

export default config;
