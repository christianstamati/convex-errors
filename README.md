# convex-errors

A library for errors in Convex apps.

```
packages/convex-errors/   the library
examples/minimal/         a Vite + React app with a Convex backend that uses it
```

## Develop

You need Bun 1.4 and Node 24. No Convex account is needed: `convex dev` offers a local deployment.

```sh
bun install
bun run dev     # local Convex deployment + http://localhost:5173
bun run test    # library tests
bun run check   # format, lint, type check
```
