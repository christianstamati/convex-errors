// One-time local setup, safe to re-run: provisions a local Convex deployment (no
// account needed), pushes the functions, and writes VITE_CONVEX_URL for the web app.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const backendDir = join(root, "packages/backend");

function run(command: string, args: string[], cwd = root) {
  return spawnSync(command, args, { cwd, stdio: "inherit" }).status === 0;
}

const ok =
  run("bunx", ["convex", "dev", "--once"], backendDir) && run("bun", ["scripts/sync-env.ts"]);
process.exit(ok ? 0 : 1);
