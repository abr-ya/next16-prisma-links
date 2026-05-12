# Research Log: Personal Link Collection

## 1. Supabase + Next.js authentication

**Decision**: Use **Supabase Auth** as the sole identity provider for v1 with the official **SSR-compatible** JavaScript client for Next.js (current `@supabase/ssr` guidance). Persist Supabase JWT/session using framework-supported cookies so Server Components and Route Handlers resolve `auth.uid()` / user id reliably.

**Rationale**: Matches sponsor stack, minimizes custom auth code, and aligns with Postgres RLS when enabled.

**Alternatives considered**: Custom credentials store (rejected—out of scope). Auth.js-only without Supabase (rejected—conflicts with sponsor).

---

## 2. Prisma with Supabase Postgres

**Decision**: Treat **PostgreSQL connection strings from Supabase** as Prisma datasource; run migrations via **`prisma migrate`**. Database schema fields include `User.id` keyed to **`auth.users.id`** (uuid) via FK or synced row on signup (exact trigger strategy decided during implementation—either insert profile row via Supabase hook or lazily upsert).

**Rationale**: Spec mandates Prisma stable; relational model folders/tags/maps fit Prisma cleanly.

**Alternatives considered**: Supabase JS only with PostgREST (rejected—no Prisma). Edge-only Drizzle without Prisma (rejected—sponsor choice).

---

## 3. Row Level Security posture

**Decision**: Enable **RLS** on application tables owning user data (`Link`, `Folder`, `Tag`, join tables). Policies allow `SELECT/INSERT/UPDATE/DELETE` only when **`user_id = auth.uid()`**. Application layer still mirrors checks to avoid leaky patterns and to support deterministic tests against Prisma errors.

**Rationale**: Matches multi-tenant security expectations without inventing bespoke ACL for v1 (**FR-003** defense in depth).

**Alternatives considered**: RLS off, app-only isolation (rejected—higher blast radius).

---

## 4. Canonical URL normalization (duplicate warnings)

**Decision**: Normalize URLs server-side **before comparing** duplicates for warnings (**FR-011**):

- Trim leading/trailing whitespace.
- Validate parseable URI with allowed schemes—default **HTTPS/HTTP minimum** (`mailto:` and others **out unless later approved**—prevents malformed noise).
- Lowercase ASCII host; strip default `:443`:443 / `:80` where applicable.
- Strip fragment (`#`).
- Optionally sort query pairs for stable comparisons (implement if query order should not differentiate duplicates).

**Rationale**: Produces predictable warnings without surprising users (`HTTP` vs `https`).

**Alternatives considered**: Raw string equality (rejected—too noisy). Aggressive redirects fetch (rejected—network cost, privacy).

---

## 5. Sorting semantics in queries/UI

**Decision**:

- **Overall collection** (**FR-014**): Primary sort `createdAt DESC` (explicit timestamp `createdAt` on `Link`).
- **Folder scoped** (**FR-015**): Primary sort **`title COLLATE` per locale configured in Postgres** (`en-US`/`und-x-icu` pinned in migrations) **ASC**; Secondary stable sort `createdAt DESC` OR `id` ASC.

**Rationale**: Mirrors clarified spec behaviors; leverages DB collation for correctness.

---

## 6. Duplicate URL UX persistence

**Decision**: Persist duplicates only after deterministic **confirmation** modal on create/update violating normalized equality against **another owned link id**. Editing a link shouldn’t warn when compared against **itself**.

**Rationale**: Satisfies **FR-011** + acceptance scenario.

---

## 7. Versions & pinning cadence

**Decision**: Exact semantic versions pinned when scaffolding (`package.json`). Re-run **`npm outdated`** or equivalent before feature freeze milestones.

**Rationale**: Sponsor asked “latest stable” without hard pinning in spec—engineering locks at generation time.

