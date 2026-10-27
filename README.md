<p align="center">
  <a href="packages/convex-errors#readme">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/glow.svg?title=convex-errors&subtitle=Typed+errors+for+Convex,+from+throw+to+toast&logo=lu:ShieldAlert&theme=orange&mode=dark">
      <img alt="convex-errors: typed errors for Convex, from throw to toast" src="https://shieldcn.dev/header/glow.svg?title=convex-errors&subtitle=Typed+errors+for+Convex,+from+throw+to+toast&logo=lu:ShieldAlert&theme=orange&mode=light">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@cs-stack/convex-errors"><img alt="npm version" src="https://shieldcn.dev/npm/@cs-stack/convex-errors.svg"></a>
  <a href="packages/convex-errors/LICENSE"><img alt="MIT license" src="https://shieldcn.dev/npm/license/@cs-stack/convex-errors.svg"></a>
</p>

# convex-errors

This repo holds [`@cs-stack/convex-errors`](https://www.npmjs.com/package/@cs-stack/convex-errors) and the apps used to try it.

**To use the library, read [packages/convex-errors/README.md](packages/convex-errors/README.md).** It covers installing, declaring, throwing, showing and translating errors.

```
packages/convex-errors/   the library
examples/minimal/         a Vite + React app with its Convex functions in convex/
examples/paraglide/       the same app on TanStack Start, in English and Italian with Paraglide
```

## Develop

You need Bun 1.4 and Node 24. No Convex account is needed: `convex dev` offers a local deployment.

```sh
bun install
bun run dev            # examples/minimal on http://localhost:5173
bun run dev:paraglide  # examples/paraglide on http://localhost:5175
bun run test           # library tests
bun run check          # format, lint, type check
```
