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

## 3. Configure Prisma

```bash
cd apps/next   # or install from root with -w @next16-links/web
npm install prisma @prisma/client --save-dev
npx prisma init --datasource-provider postgresql
```

Set `.env`:

```bash
DATABASE_URL="postgresql://..."        # Supabase Postgres connection string
DIRECT_DATABASE_URL="postgresql://..." # optional bypass for migrations
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."        # NEVER expose client-side
```

Model tables per [data-model.md](./data-model.md), then:

```bash
npx prisma migrate dev --name init_links
```

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

