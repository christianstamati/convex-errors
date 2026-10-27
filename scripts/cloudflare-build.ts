// Build command for Cloudflare Workers Builds, run from apps/web (the Worker's root
// directory). Installs the workspace and runs `bun run check` and `bun run test`, so a
// failing check stops the deploy. Then runs `convex deploy`, which pushes the Convex
// functions and builds apps/web with VITE_CONVEX_URL pointing at them:
//   - production branch (PRODUCTION_BRANCH, default main): CONVEX_DEPLOY_KEY, a production
//     deploy key. Workers Builds then runs `wrangler deploy`.
//   - any other branch: CONVEX_PREVIEW_DEPLOY_KEY, a preview deploy key. Convex creates a
//     preview deployment named after the branch, and reuses it on later pushes. Workers
//     Builds then runs `wrangler preview`.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const rootDir = join(import.meta.dirname, "..");
const branch = process.env.WORKERS_CI_BRANCH;
const productionBranch = process.env.PRODUCTION_BRANCH || "main";

if (!branch) {
  console.error(
    "WORKERS_CI_BRANCH is not set. This script runs in Workers Builds. To deploy by hand, see the README.",
  );
  process.exit(1);
}

const isProduction = branch === productionBranch;
const keyName = isProduction ? "CONVEX_DEPLOY_KEY" : "CONVEX_PREVIEW_DEPLOY_KEY";
const deployKey = process.env[keyName];
if (!deployKey) {
  console.error(`${keyName} is not set. Add it under Settings > Build > Variables and secrets.`);
  process.exit(1);
}

function run(command: string, args: string[], env?: NodeJS.ProcessEnv) {
  const result = spawnSync(command, args, { cwd: rootDir, stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Branch ${branch}: ${isProduction ? "production" : "preview"} build.`);
run("bun", ["install", "--frozen-lockfile"]);
run("bun", ["run", "check"]);
run("bun", ["run", "test"]);
run(
  "bun",
  [
    "run",
    "--cwd",
    "packages/backend",
    "deploy",
    ...(isProduction ? [] : ["--preview-name", branch]),
  ],
  { ...process.env, CONVEX_DEPLOY_KEY: deployKey },
);
