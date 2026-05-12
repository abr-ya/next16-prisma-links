# Deploying `@next16-links/web` (Next in `apps/next`) on Vercel

Vercel must install dependencies from the **monorepo root** so npm workspaces (`packages/*`, `apps/telegram-mini`) resolve correctly.

## Dashboard settings

| Setting | Value |
|---------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/next` |
| **Install Command** | `cd ../.. && npm ci` |
| **Build Command** | `cd ../.. && npm run build -w @next16-links/web` |
| **Output Directory** | (leave default — Next resolves under `apps/next`) |

Notes:

- If you use **`npm install`** instead of `ci`, use the same `cd ../.. && …` prefix.
- If the root **`package-lock.json`** is missing, run `npm install` once locally at the repo root and commit the lockfile.
- Env vars (Supabase, `DATABASE_URL`, etc.) are set per project on Vercel as usual—they apply to the built app regardless of subdirectory.

## Optional: Turborepo later

After adding Turbo, the **Build Command** often becomes something like `cd ../.. && npx turbo run build --filter=@next16-links/web` — align with whatever you encode in [`package.json`](../package.json).

## Mini App workspace

Do **not** point this Vercel project at `apps/telegram-mini`; that SPA should be its own deployment (Static host or separate Vercel project with **Root Directory** `apps/telegram-mini` once Vite builds exist).
