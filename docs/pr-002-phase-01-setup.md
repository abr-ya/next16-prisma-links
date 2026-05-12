# Pull Request: `002-phase-01-setup` → `master`

Draft for the **Phase 1 — Setup** delivery PR. Copy sections into the host’s PR body and trim if the diff diverges.

## Metadata

| Field | Value |
|--------|--------|
| **Source branch** | `002-phase-01-setup` |
| **Target branch** | `master` |
| **Phase** | [Phase 1: Setup](../specs/001-personal-link-collection/tasks.md#phase-1-setup-shared-infrastructure) |
| **Task IDs** | **T001**, **T002**, **T003**, **T004**, **T005** (all marked done in `tasks.md`) |

## Suggested PR titles

```
chore(phase-01): monorepo scaffold, Prisma 7, TypeScript 6, root ESLint
```

or:

```
chore: Phase 1 setup — workspaces, Next app, Prisma 7, lint stack
```

## PR description (body)

### Purpose

Complete **Phase 1 (Shared Infrastructure)** from [tasks.md](../specs/001-personal-link-collection/tasks.md): npm workspaces, Next.js app under **`apps/next`** (`@next16-links/web`), planned directory layout, Prisma **7** wiring (schema + `prisma.config.ts`, generated client path), env template, Supabase + Zod dependencies, and **repo-root** ESLint + Prettier aligned with the monorepo.

### What changed (high level)

- **Workspaces**: root `package.json` with `apps/*`, `packages/*`; scripts `dev`, `build`, `lint`, `typecheck`.
- **Web app**: `apps/next` — Next 16 App Router, Tailwind, TypeScript **6**, shared lint from repo root.
- **Prisma 7**: `apps/next/prisma/schema.prisma` (PostgreSQL provider; URL in `prisma.config.ts`); `postinstall` / `db:generate`; client output under `lib/generated/prisma` (gitignored); `@prisma/adapter-pg`, `pg` for later runtime wiring in Phase 2.
- **Supabase / validation**: `@supabase/ssr`, `@supabase/supabase-js`, `zod`; `apps/next/.env.example`.
- **Layout placeholders**: `components/{links,folders,tags,ui}/`, `lib/{auth,db,validation,urls}/`, `tests/{unit,e2e}/` (`.gitkeep` where needed).
- **Docs**: [monorepo.md](./monorepo.md), [vercel.md](./vercel.md), [eslint-typescript-tooling.md](./eslint-typescript-tooling.md) (ESLint **9** pin and when to revisit **10**).

### Per-phase testing (Phase 1)

Vitest is **not** in scope for Phase 1 (see **T017** in Phase 2). Smoke checks for this PR:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run db:generate -w @next16-links/web
```

**Note:** `npm run lint` may report **one warning** on `apps/next/app/layout.tsx` (`react-refresh/only-export-components` vs `metadata` export). No errors expected after Prettier is satisfied.

If your merge policy requires a single `npm test` entrypoint, either add a root script that chains `lint` + `typecheck` or document in this PR that Phase 1 gate is the four commands above (exception to strict “`npm test` only” wording in [tasks.md](../specs/001-personal-link-collection/tasks.md) — justify in PR if needed).

### Out of scope (later phases)

- Prisma **models**, migrations, RLS SQL, auth routes, Vitest — **Phase 2+** ([tasks.md](../specs/001-personal-link-collection/tasks.md)).
- Runtime `PrismaClient` singleton with `PrismaPg` adapter in `lib/db/prisma.ts` — **Phase 2** when DB access lands.

### References

- [quickstart.md](../specs/001-personal-link-collection/quickstart.md) — updated for Prisma 7 layout.
- [eslint-typescript-tooling.md](./eslint-typescript-tooling.md) — ESLint 9 vs 10 and upgrade checklist.

---

## Reviewer checklist

- [ ] No secrets in git (only `.env.example`; real values stay local / CI secrets).
- [ ] `specs/001-personal-link-collection/tasks.md` shows **T001–T005** completed for Phase 1.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` succeed from a clean `npm install`.
- [ ] `lib/generated/` remains untracked (see `apps/next/.gitignore`).

---

## Suggested commit message (single commit or squash)

**Subject (≤72 chars):**

```
chore(phase-01): workspaces, Next app, Prisma 7, TS 6, root ESLint
```

**Body:**

```
Phase 1 (T001–T005): npm workspaces; apps/next @next16-links/web with
planned dirs; Prisma 7 (prisma.config.ts, generated client path, adapter
deps); .env.example; Supabase + zod; root eslint.config.mjs + Prettier;
docs (monorepo, Vercel, ESLint/TS pins); quickstart + tasks checkboxes.

Vitest deferred to Phase 2 (T017). ESLint 10 blocked until eslint-plugin-react
+ eslint-config-next support; see docs/eslint-typescript-tooling.md.
```

Shorter one-liner if you prefer:

```
chore(phase-01): scaffold monorepo, Prisma 7, and shared lint (T001–T005)
```

---

## Quick PR setup from CLI (example)

```bash
git push -u origin 002-phase-01-setup
# Open compare: 002-phase-01-setup → master and paste the PR body from above.
```

When the branch contents change, refresh **What changed** and the reviewer checklist in this file before copying into the PR.
