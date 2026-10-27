# tanstack-convex-starter

A boilerplate TypeScript monorepo with a TanStack Start web app, a Convex backend and
shadcn/ui on Base UI, set up to deploy to Cloudflare Workers. It includes one example
feature, a notes list, to show the wiring end to end. There is no sign-in: every Convex
function is public, so add auth before you store anything private.

## Stack

| Layer    | Choice                                                                                  |
| -------- | --------------------------------------------------------------------------------------- |
| Monorepo | Bun workspaces, Vite+ (`vp`) for format, lint, type check, tests and tasks              |
| Frontend | TanStack Start (React) in `apps/web`, with TanStack Query                               |
| Backend  | Convex in `packages/backend`. Functions are the API, no separate server                 |
| UI       | shadcn/ui on Base UI and Tailwind CSS v4 in `packages/ui`. Nova, neutral, Lucide, Geist |
| Tests    | Vitest, with convex-test for Convex functions                                           |
| CI       | The Cloudflare build: check, test, build, then deploy                                   |
| Deploy   | Cloudflare Workers Builds for the web app, Convex Cloud for the backend, with previews  |

## Run it locally

You need Bun 1.4 and Node 24. No Convex account is needed to start.

```sh
bun install
bun run setup   # local Convex deployment and apps/web/.env.local
bun run dev     # Convex + http://localhost:3000
```

`setup` creates a Convex deployment that runs on your machine and stores its data in
`packages/backend/.convex/`. It is safe to re-run.

Other commands:

```sh
bun run check      # format, lint, types. `vp check --fix` fixes what it can
bun run test       # unit tests
bun run build      # production build of apps/web
```

## Environment variables

`bun run setup` writes the local files. `.env.example` documents every variable.

| Variable                        | Where                               | Set by                                 | Purpose                                   |
| ------------------------------- | ----------------------------------- | -------------------------------------- | ----------------------------------------- |
| `VITE_CONVEX_URL`               | `apps/web/.env.local`, deploy build | `scripts/sync-env.ts`, `convex deploy` | Convex URL the browser connects to        |
| `CONVEX_DEPLOYMENT`             | `packages/backend/.env.local`       | `convex dev`                           | Deployment the Convex CLI targets         |
| `CONVEX_URL`, `CONVEX_SITE_URL` | `packages/backend/.env.local`       | `convex dev`                           | Deployment URLs                           |
| `CONVEX_DEPLOY_KEY`             | Workers Builds secret               | you                                    | Deploys `main` to Convex production       |
| `CONVEX_PREVIEW_DEPLOY_KEY`     | Workers Builds secret               | you                                    | Deploys other branches to Convex previews |

Env vars a Convex function reads live on the deployment, not in a file. Set them from
`packages/backend` with `bunx convex env set NAME value`.

## Deploy

Cloudflare Workers Builds builds and deploys the app from the GitHub repo. Every push to
`main` deploys production. Every other branch gets a preview: a Cloudflare Preview URL,
posted on its pull request, backed by its own Convex preview deployment. Nothing has been
deployed yet. When you're ready:

1. Link a Convex Cloud project: `cd packages/backend && bunx convex login && bunx convex dev --configure`.
   This replaces the local deployment in `packages/backend/.env.local`. Run
   `bun run setup` again to point the web app at it.
2. In the Convex dashboard, generate a production deploy key and a preview deploy key.
3. In the Cloudflare dashboard, go to Workers & Pages > Create > Import a repository, pick
   this repo and set:

   | Setting         | Value                                                              |
   | --------------- | ------------------------------------------------------------------ |
   | Project name    | `tanstack-convex-starter`, the `name` in `apps/web/wrangler.jsonc` |
   | Root directory  | `apps/web`                                                         |
   | Build command   | `bun run build:cloudflare`                                         |
   | Deploy command  | `bunx wrangler deploy`                                             |
   | Preview command | `bunx wrangler preview`                                            |
   | Build variables | `BUN_VERSION` = `1.4.4`, `SKIP_DEPENDENCY_INSTALL` = `1`           |
   | Build secrets   | `CONVEX_DEPLOY_KEY`, `CONVEX_PREVIEW_DEPLOY_KEY`                   |

   Then check that Settings > Build > Branch control has `main` as the production branch
   and Enable Preview Builds turned on. The commands use `bunx`, not the default `npx`,
   because npm refuses to run in a repo whose `devEngines` names Bun.

The build command runs `scripts/cloudflare-build.ts`. It installs the workspace from the
repo root, then runs `convex deploy`, which pushes the Convex functions and builds the app
with `VITE_CONVEX_URL` pointing at them. On `main` it uses `CONVEX_DEPLOY_KEY` and the
production deployment. On any other branch it uses `CONVEX_PREVIEW_DEPLOY_KEY`, which
creates a Convex preview deployment named after the branch and reuses it on later pushes.
Cloudflare then runs the deploy command on `main` and the preview command elsewhere, and
reports each build as a check on the commit.

There is no separate CI. The build script runs `bun run check` and `bun run test` before
`convex deploy`, so a failing check stops both preview and production deploys. `main` is
protected: changes go in through a pull request, and the PR can only merge once its
Cloudflare build (the `Workers Builds: tanstack-convex-starter` check) passes. Each PR gets a
Cloudflare preview, and merging deploys production. Admins can still push to `main`
directly; the build still runs the checks, but nothing blocks the push itself. `bun run dev` and `vp preview` run the app in
workerd, the Workers runtime, so what you test locally is what deploys.

To deploy production by hand instead: `bunx wrangler login` in `apps/web`, then
`CONVEX_DEPLOY_KEY=... bun run --cwd packages/backend deploy && bun run --cwd apps/web deploy`.

## Remove the example feature

Delete these files and lines, then run `bun run check`:

- `packages/backend/convex/notes.ts` and `packages/backend/convex/notes.test.ts`
- the `notes` table in `packages/backend/convex/schema.ts`
- `apps/web/src/routes/notes.tsx`
- the Notes link in `apps/web/src/routes/index.tsx`

`bun run dev` regenerates `apps/web/src/routeTree.gen.ts` and `convex/_generated`.
