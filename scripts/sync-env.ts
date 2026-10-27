// Copies the Convex deployment URL written by `convex dev` (packages/backend/.env.local)
// into the web app's env file as VITE_CONVEX_URL, keeping any other lines intact.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const backendEnv = join(root, "packages/backend/.env.local");
const webEnv = join(root, "apps/web/.env.local");

if (!existsSync(backendEnv)) {
  console.error("packages/backend/.env.local not found. Run `bun run setup` first.");
  process.exit(1);
}

const convexUrl = readFileSync(backendEnv, "utf8")
  .match(/^CONVEX_URL=(.+)$/m)?.[1]
  ?.trim();
if (!convexUrl) {
  console.error("CONVEX_URL is missing from packages/backend/.env.local.");
  process.exit(1);
}

const lines = existsSync(webEnv)
  ? readFileSync(webEnv, "utf8")
      .split("\n")
      .filter((line) => line !== "" && !line.startsWith("VITE_CONVEX_URL="))
  : [];
lines.push(`VITE_CONVEX_URL=${convexUrl}`);
writeFileSync(webEnv, `${lines.join("\n")}\n`);
console.log(`apps/web/.env.local: VITE_CONVEX_URL=${convexUrl}`);
