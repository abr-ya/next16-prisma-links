# Quickstart: Personal Link Collection (Development)

These steps scaffold the greenfield repo with **Next.js**, **Supabase**, and **Prisma** aligned to [plan.md](./plan.md) and [research.md](./research.md).

## Prerequisites

1. **Node.js** LTS aligned with targeted Next release.
2. **Supabase CLI** logged into the correct project _(optional but recommended)_.
3. **Git** checkout on branch `001-personal-link-collection`.

## 1. Bootstrap Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false
```

> Adjust flags if the repo already contains partial files—avoid overwriting Speckit docs under `specs/`.

Pin versions in Git after scaffold.

## 2. Configure Supabase

1. Create a Supabase project.
2. Enable **Authentication** providers required for development (often email/password + magic links).
3. Copy **project URL**, **anon key**, and **`service_role`** (server-only secrets) plus **DATABASE_URL** (preferred: pooler URI for Prisma with `sslmode=require`).

## 3. Configure Prisma

```bash
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

