<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `bunx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `bunx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Project Context

## Scaffold provenance

- Exact initial command: `npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager pnpm --tailwind --deployment cloudflare`
- Interactive selections: React, Biome, no demo/example pages, no add-ons, Cloudflare deployment, and Git initialization.
- The CLI generated `my-tanstack-app/`; its contents were moved unchanged to the workspace root before toolchain normalization.
- The CLI reported that `--tailwind` is deprecated and ignored because Tailwind is always included in TanStack Start scaffolds.
- Required follow-up commands run from the workspace root:
  - `npx @tanstack/intent@latest install`
  - `npx @tanstack/intent@latest list`
- Intent list result at scaffold time: no intent-enabled packages found. It also warned that `intent.skills` is not set. Re-run the list command before substantial future work and load any newly available matching skill before editing.

## Chosen stack and integrations

- React 19 with TanStack Start and TanStack Router file-based routing.
- Blank starter: only the root route and minimal welcome content; no optional add-ons or feature scaffolding.
- Cloudflare Workers deployment through `@cloudflare/vite-plugin` and Wrangler.
- Tailwind CSS is retained because it is part of the current default TanStack Start scaffold.
- Biome is the generated formatter/linter/checker.
- Bun is the final package manager. The mandated scaffold command initially used pnpm; `package.json`, scripts, and the lockfile were then normalized to Bun.
- shadcn/ui preset `b3sQCqADSS` is applied using Base UI, Geist fonts, Lucide icons, and the preset's CSS variables.

## Commands

- Install: `bun install`
- Develop: `bun run dev`
- Check: `bun run check`
- Test: `bun run test`
- Build: `bun run build`
- Preview: `bun run preview`
- Deploy: `bun run deploy`

## Environment and deployment

- No application environment variables are required by the blank starter.
- Authenticate before the first deployment with `bunx wrangler login`.
- Deploy with `bun run deploy`; configuration lives in `wrangler.jsonc`.
- Add non-secret Cloudflare Worker variables under `vars` in `wrangler.jsonc`.
- Add production secrets with `bunx wrangler secret put <NAME>` and document any new variables in `.env.example`.
- For local-only values, use an uncommitted `.dev.vars` file when Cloudflare bindings are introduced.

## Architecture and gotchas

- Preserve the generated structure. Routes live in `src/routes`; `src/routeTree.gen.ts` is generated and must not be edited manually.
- `vite.config.ts` wires Cloudflare, Tailwind, TanStack Start, React, and generated devtools in the CLI-provided order.
- The Cloudflare Vite plugin is skipped only in Vitest's `test` mode because its Worker environment conflicts with Vitest's Node externalization; it remains active for development and production builds.
- The blank starter contains no tests, so the test script uses Vitest's `--passWithNoTests` flag until tests are added.
- The generated Biome 2.2.4 schema was migrated to the installed Biome 2.4.5 schema, and generated source files were formatted once to make `bun run check` pass.
- Keep `wrangler.jsonc` aligned with Cloudflare bindings and compatibility requirements.
- Do not add integrations or feature scaffolding until a product requirement calls for them.
- Run TanStack Intent list/load before architectural or TanStack-library-specific changes; package-shipped guidance takes precedence over guesses.
- shadcn preset command: `bunx --bun shadcn@latest apply --preset b3sQCqADSS`.
- The shadcn preset CSS lives directly in `src/styles.css`, which is loaded by the TanStack Start root document and targeted by `components.json` for future component commands.
- Keep `components.json` set to `rsc: false`; this app uses TanStack Start SSR, not React Server Components.
- Keep `verbatimModuleSyntax` disabled in `tsconfig.json` as required by the package-shipped TanStack Start guidance.

## Next steps

- Replace the minimal root route when product requirements are defined.
- Configure a Cloudflare account and any required bindings only when the app needs them.
