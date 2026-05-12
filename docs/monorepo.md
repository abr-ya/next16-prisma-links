# Monorepo layout (`next16-links`)

## Do we need extra tooling?

**No package is strictly required.** **npm workspaces** (declared in the root [`package.json`](../package.json)) are enough to:

- hoist shared dependencies safely,
- add local packages (`@next16-links/shared`) imported from multiple apps via `workspace:*`.

### Optional later: Turborepo or Nx

| Tool | When it helps |
|------|----------------|
| **[Turborepo](https://turbo.build/)** (`turbo`) | Cached `build`/`test`/`lint` across workspaces, one CI entrypoint |
| **[Nx](https://nx.dev/)** | Larger monorepo, graph tooling, codegen |

Start without them; add Turborepo when `npm run build` at root should orchestrate `web + mini + shared`.

## Services (logical)

| Workspace | Role |
|-----------|------|
| `apps/next/` (`@next16-links/web`) | Next.js **web UI** + **API** (Route Handlers). Single deploy unit for HTTPS + Postgres/Supabase/Prisma. |
| `apps/telegram-mini/` | **Telegram Mini App** UI (thin SPA once scaffolded). Talks HTTP(S) to the Next API. |
| `packages/shared/` | Optional **contracts / Zod schemas / TS types** shared by web API and Mini App. |

Webhook bot logic can live in **`apps/next/app/api`** (same deploy) until you split it.

## Package name vs folder

The npm package **must not** be named `next` (conflicts with the `next` framework dependency). The workspace is **`@next16-links/web`** inside folder **`apps/next`** — short path, clear deploy target.

Deploy notes for **Vercel**: see **[vercel.md](./vercel.md)**.

## Lint / TypeScript stack

Central **ESLint 9** + **typescript-eslint 8** + **Prettier** live at the repository root (shared flat config). **Why ESLint is not on v10 yet** and what to revisit after upstream stabilizes is documented in **[eslint-typescript-tooling.md](./eslint-typescript-tooling.md)**.

**Phase 1 PR** (setup branch → `master`): use **[pr-002-phase-01-setup.md](./pr-002-phase-01-setup.md)** as the PR description draft.
