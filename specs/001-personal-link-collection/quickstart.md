# Quickstart: Personal Link Collection (Development)

These steps scaffold the greenfield repo with **Next.js**, **Supabase**, and **Prisma** aligned to [plan.md](./plan.md) and [research.md](./research.md).

## Prerequisites

1. **Node.js** LTS aligned with targeted Next release.
2. **Supabase CLI** logged into the correct project _(optional but recommended)_.
3. **Git** checkout on branch `001-personal-link-collection`.

## 1. Monorepo + Next.js app

The web app lives under **`apps/next`** (package **`@next16-links/web`**). From the **repository root**:

```bash
npm install
npm run dev
```

Bootstrap (if you recreate from scratch): scaffold into `apps/next/` and add the folder to root `package.json` **`workspaces`** (`apps/*`). See [plan.md](./plan.md) and [docs/monorepo.md](../../docs/monorepo.md). Production deploy on Vercel: [docs/vercel.md](../../docs/vercel.md).

## 2. Configure Supabase

1. Create a Supabase project.
2. Enable **Authentication** providers required for development (often email/password + magic links).
3. Copy **project URL**, **anon key**, and **`service_role`** (server-only secrets) plus **DATABASE_URL** (preferred: pooler URI for Prisma with `sslmode=require`).

## 3. Configure Prisma (ORM **v7** in this repo)

Packages and generated client are already declared under **`apps/next`**. Prisma **7** splits:

- **`prisma/schema.prisma`** — generator + `datasource` **provider only** (connection URL is not stored here).
- **`prisma.config.ts`** (next to `apps/next/package.json`) — `datasource.url`, migrations path, `dotenv` loading.
- **Generated client** outputs to **`apps/next/lib/generated/prisma`** (ignored by git). Imports in app code use that path once models exist (see Prisma 7 upgrade guide).

From the **repository root**:

```bash
npm install
npm run db:generate -w @next16-links/web   # or: cd apps/next && npx prisma generate
```

Copy **`apps/next/.env.example`** → **`.env.local`** (or `.env`) and fill real values:

```bash
DATABASE_URL="postgresql://..."        # Supabase Postgres (pooler URI is common for runtime)
DIRECT_DATABASE_URL="postgresql://..." # optional: direct URL if your host requires it for migrations
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."       # NEVER expose client-side
```

`postinstall` runs **`prisma generate`** so a placeholder `DATABASE_URL` is only needed when you run migrations or a direct DB command; for codegen alone the repo uses a non-connecting fallback in **`prisma.config.ts`**.

Model tables per [data-model.md](./data-model.md), then (from **`apps/next`** or via workspace scripts you add):

```bash
cd apps/next && npx prisma migrate dev --name init_links
```

Runtime **`PrismaClient`** in v7 uses a **driver adapter** (e.g. `@prisma/adapter-pg` + **`pg`**); wire that when you add `lib/db/prisma.ts` in the foundational phase.

## 4. Supabase SSR wiring

Install Supabase SSR utilities per official docs (`@supabase/ssr` baseline). Provide:

- `lib/auth/server-client.ts`
- `lib/auth/browser-client.ts`
- Middleware (`middleware.ts`) refreshing sessions—follow current Supabase Next.js pairing guide.

## 5. Run locally

```bash
npm run dev
```

## 6. Tests

Install testing packages per plan (Vitest, RTL, Playwright). Wire scripts in `package.json` when ready.

## 7. Next Speckit step

Run `/speckit.tasks` to break work into ordered tasks referencing **US*** and **FR*** identifiers.

