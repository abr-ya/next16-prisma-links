---
description: "Task list for Personal Link Collection feature implementation"
---

# Tasks: Personal Link Collection

**Input**: Design documents from `/specs/001-personal-link-collection/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md), [research.md](./research.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Follow **[Per-phase testing](#per-phase-testing-tdd-or-tests-immediately-after)** (TDD when practical; otherwise automated tests added immediately after implementation in the **same** phase branch—before PR).

**Organization**: Phases follow user-story priority (P1 → P4); **FR-xxx** cited for traceability to [spec.md](./spec.md).

**Path convention**: Unless a path starts with `packages/`, `apps/telegram-mini/`, `specs/`, `supabase/`, or `docs/`, treat it as **`apps/next/<path>`** (Next workspace `@next16-links/web`). Examples: `lib/db/prisma.ts` → `apps/next/lib/db/prisma.ts`; `middleware.ts` → `apps/next/middleware.ts`.

## Per-phase testing (TDD or tests immediately after)

For **every** delivery phase (1–7):

1. **Prefer TDD** for new behavior: write a failing automated test first, then implement until green (unit/integration via Vitest + React Testing Library where it fits; Playwright when a user flow deserves end-to-end coverage). Tooling matches [plan.md](./plan.md).
2. **If TDD is impractical** because of clear **architectural or sequencing friction** (e.g. exploratory UI, unstable third-party callbacks, spike before contracts settle): implement the phase work first, then **in the same feature branch and before opening the PR** add automated tests that pin the behavior shipped in that phase—**no merge** until those tests exist and pass together with the rest of the suite (regressions included).
3. In the **PR description**, state when you used exception (2) and point to the tests added in the same PR.

## Git workflow & PR merges (delivery)

- **Implement each numbered phase below in its own feature branch.** Suggested branch name is listed under **Feature branch**.
- Branch from **`master`** at the commit where the previous phase was merged (or from `master`’s HEAD if this is Phase 1).
- **Do not merge locally without review unless your team agrees otherwise.** Open a **Pull Request** into **`master`** for each phase.
- **Merge criteria for every PR**: phase implementation **done**; **[Per-phase testing](#per-phase-testing-tdd-or-tests-immediately-after)** satisfied (TDD path or same-branch tests-after with justification); **green CI / full test + lint + typecheck** you run for the repo; PR cites **phase**, **Task IDs** (**Txxx**), and any TDD exception.
- **Branch numbering**: implementation branches use **ascending prefixes** **`002`, `003`, …`** (one per phase) so history sorts clearly—see **Feature branch** under each phase (e.g. `002-phase-01-setup`, `003-phase-02-foundational`, …). The **`001-*`** Speckit / spec branch stays separate from these delivery branches.
- This file and other Speckit docs may live on a documentation branch (`001-personal-link-collection`, etc.)—implementation phase branches remain separate for code churn.

## Format

`- [ ] [TaskID] [P?] [Story?] Description with file path`

---

## Phase 1: Setup (Shared Infrastructure)

**Feature branch**: `002-phase-01-setup` (from `master`)  
**Merge**: PR → `master` after **all tests/typecheck/lint** you have configured for Phase 1 are green.  
**Testing**: Per [Per-phase testing](#per-phase-testing-tdd-or-tests-immediately-after)—e.g. smoke test that `npm test` / lint pipeline runs after scaffold (TDD rarely applies to raw scaffold; still verify CI hooks in this PR).

**Purpose**: Scaffold the repo per [plan.md](./plan.md) and [quickstart.md](./quickstart.md).

- [x] T001 Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) in **`apps/next`** as workspace **`@next16-links/web`** (root [`package.json`](../../package.json) lists `apps/*`); preserve `/specs/**` at repo root. Files: `apps/next/next.config.ts` or `next.config.mjs`, `apps/next/app/`, `apps/next/tsconfig.json`, root `package.json` workspaces orchestration.
- [x] T002 Create directory layout aligned with plan **under `apps/next/`**: `apps/next/components/links/`, …, `apps/next/lib/auth/`, `apps/next/lib/db/`, … `apps/next/tests/unit/`, `apps/next/tests/e2e/`
- [x] T003 Initialize Prisma inside **`apps/next`**: run installs from repo root with workspace flag or `cd apps/next` + `npm install prisma @prisma/client` as appropriate; **`apps/next/prisma/schema.prisma`** with PostgreSQL `datasource db` placeholders.
- [x] T004 `[P]` Add `.env.example` documenting `DATABASE_URL`, optional `DIRECT_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)
- [x] T005 `[P]` Install `@supabase/ssr` `@supabase/supabase-js` and `zod` per plan `package.json` dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Feature branch**: `003-phase-02-foundational` (from `master` after Phase 1 merged)  
**Merge**: PR → `master`; block merge until migrations + auth shell + normalization helper are covered by your test/lint gates.  
**Testing**: **TDD preferred** for `lib/urls/normalize.ts`, Zod parsers, and auth-gated helpers; if integration with Supabase makes red-first awkward, add tests **immediately after** wiring in this same branch before PR ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Purpose**: Shared infrastructure (**FR-001**, **FR-003**, normalization **FR-011**, validation plumbing). Blocks all user-story phases until complete.

- [ ] T006 Model `Folder`, `Tag`, `Link`, `LinkTag` (and optional `User`/profile keyed to Supabase UUID) exactly per [data-model.md](./data-model.md) inside `prisma/schema.prisma` including uniqueness constraints (**FR-012**, **FR-013**) and `Link.folderId → Folder` FK with **RESTRICT** semantics for non-empty-folder deletes (**FR-007**)
- [ ] T007 Apply first migration generating `prisma/migrations/**` reflecting schema and run `prisma migrate dev` locally documenting command in README if needed `README.md`
- [ ] T008 `[P]` Author supplemental SQL applying Supabase Row Level Security policies tying rows to `auth.uid()` mirroring server checks (deploy via Supabase SQL editor/migrations workflow) `supabase/policies/rls-links.sql`
- [ ] T009 Implement Prisma singleton for server contexts `lib/db/prisma.ts`
- [ ] T010 `[P]` Implement Supabase SSR server client helpers `lib/auth/supabase-server.ts`
- [ ] T011 `[P]` Implement browser client helper `lib/auth/supabase-browser.ts`
- [ ] T012 Add session/cookie middleware **`apps/next/middleware.ts`** (Next resolves middleware from the web app root per framework rules) using current Supabase Next.js SSR guidance.
- [ ] T013 Create protected route group shell redirecting unauthenticated visitors to login `app/(dashboard)/layout.tsx`
- [ ] T014 `[P]` Implement minimal sign-in page & callback handling `app/login/page.tsx` `app/auth/callback/route.ts` (email magic link or provider per project choice)
- [ ] T015 Implement canonical URL normalization helper per [research.md](./research.md) `lib/urls/normalize.ts` (used for **FR-011** duplicate detection)
- [ ] T016 `[P]` Add Zod input schemas for link write, folder, tag payloads `lib/validation/linkWrite.ts` `lib/validation/folder.ts` `lib/validation/tag.ts` aligned with [contracts/openapi.yaml](./contracts/openapi.yaml)
- [ ] T017 `[P]` Add Vitest + React Testing Library baseline config `vitest.config.ts` `tests/setup.ts`

**Checkpoint**: Database schema + auth gate + validation utilities ready → begin user stories.

---

## Phase 3: User Story 1 — Save and manage links (Priority: P1) — MVP 🎯

**Feature branch**: `004-phase-03-us1-links` (from `master` after Phase 2 merged)  
**Merge**: PR → `master` after MVP acceptance scenarios ([spec](./spec.md) US1) and full test suite pass.  
**Testing**: **TDD** for server actions/query rules (duplicate URL, sort order, isolation); RTL or integration tests for `LinkForm` / duplicate modal; defer Playwright-only **only if** justified—then still add narrower tests first ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Goal**: Authenticated CRUD on links plus duplicate-URL warning + newest-first ordering in overall view (**FR-002**, **FR-011**, **FR-014**, **FR-001**).

**Independent Test**: Signed-in user creates link with URL+title, sees it newest in overall list; edits fields; deletes; duplicate URL warns; unauthorized users routed away.

### Implementation for User Story 1

- [ ] T018 `[US1]` Implement Prisma-backed query fetching all links for current user sorted `createdAt desc` when not folder-scoped `lib/links/queries.ts`
- [ ] T019 `[US1]` Implement `createLink` server workflow detecting conflicting `urlNormalized` for another owned link requiring explicit confirm flag returns structured duplicate payload **without persisting until confirmed** `lib/actions/linkActions.ts`
- [ ] T020 `[US1]` Implement `updateLink` / `deleteLink` enforcing `userId` match and self-excluding duplicate detection on edits `lib/actions/linkActions.ts`
- [ ] T021 `[P] [US1]` Build reusable link list presenting overall ordering `components/links/LinkList.tsx`
- [ ] T022 `[P] [US1]` Build create/edit form with duplicate confirmation modal `components/links/LinkForm.tsx`
- [ ] T023 `[US1]` Compose dashboard landing page wiring queries + mutations + loading/error UX `app/(dashboard)/dashboard/page.tsx` (or `app/(dashboard)/page.tsx`)

**Checkpoint**: MVP (**US1**) shippable—validate acceptance scenarios 1–6 for story 1 in [spec.md](./spec.md).

---

## Phase 4: User Story 2 — Organize links in folders (Priority: P2)

**Feature branch**: `005-phase-04-us2-folders` (from `master` after Phase 3 merged)  
**Merge**: PR → `master`; green tests including regression on US1.  
**Testing**: **TDD** for folder delete guard, uniqueness errors, scoped sort **FR-015**; regressions must cover US1 paths ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Goal**: Folder CRUD, assign links, block delete when non-empty, unique folder names, alphabetical ordering inside folder context (**FR-004**, **FR-007**, **FR-012**, **FR-015**).

**Independent Test**: Create folders, move links, filter by folder, delete only when empty, reject duplicate folder names, verify alpha sort within folder view.

### Implementation for User Story 2

- [ ] T024 `[US2]` Implement folder server actions (create/rename/delete guard) surfacing Prisma unique violations as friendly errors `lib/actions/folderActions.ts`
- [ ] T025 `[US2]` Extend link update action to set/clear `folderId` honoring FK restrictions `lib/actions/linkActions.ts`
- [ ] T026 `[US2]` Add query variant returning links for one folder ordered by `title` asc + stable secondary key `lib/links/queries.ts`
- [ ] T027 `[P] [US2]` Build folder navigation UI (overall vs folder context) reflecting sort rule switch **FR-014/FR-015** `components/folders/FolderNav.tsx`
- [ ] T028 `[P] [US2]` Build folder management UI (create/rename/delete) `components/folders/FolderManageDialog.tsx`
- [ ] T029 `[US2]` Add routed folder view consuming scoped query `app/(dashboard)/folders/[folderId]/page.tsx`

**Checkpoint**: Folder flows pass story 2 acceptance scenarios independently alongside US1 backlog pages.

---

## Phase 5: User Story 3 — Tag links and narrow the list (Priority: P3)

**Feature branch**: `006-phase-05-us3-tags` (from `master` after Phase 4 merged)  
**Merge**: PR → `master`; green tests; confirm AND filter semantics (**FR-006**).  
**Testing**: **TDD** for tag assignment transactions and combined `folderId`+`tagId` filters; same-branch tests before PR ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Goal**: Tag CRUD, link↔tag assignment, filters for tag-only and intersecting folder+tag (**FR-005**, **FR-006**, **FR-013**).

**Independent Test**: Create tags, attach multiple tags, filter by tag, combine with folder selecting AND semantics, reject duplicate tag names.

### Implementation for User Story 3

- [ ] T030 `[US3]` Implement tag CRUD actions with uniqueness handling `lib/actions/tagActions.ts`
- [ ] T031 `[US3]` Implement transactional replacement of tag assignments per save operation `lib/actions/linkTagActions.ts`
- [ ] T032 `[US3]` Extend `lib/links/queries.ts` filtering helpers for `tagId`, `folderId`, and combined AND filters preserving correct default sorts per **FR-014**/**FR-015**
- [ ] T033 `[P] [US3]` Build tag filter + chips UI `components/tags/TagFilter.tsx` `components/tags/TagChips.tsx`
- [ ] T034 `[US3]` Ensure link cards show all assigned tags in list/detail surfaces `components/links/LinkListItem.tsx`

**Checkpoint**: Tag scenarios operate without breaking US1/US2 behaviors.

---

## Phase 6: User Story 4 — Richer browsing: previews and layouts (Priority: P4) — Stretch / SHOULD

**Feature branch**: `007-phase-06-us4-layouts-previews` (from `master` after Phase 5 merged; branch may be postponed)  
**Merge**: PR → `master` only if/stretch when this phase is in scope.  
**Testing**: Layout toggles and preview route often suit **tests-after** first; still add RTL/component + contract tests for preview timeout/placeholder **before PR**—use TDD where the behavior is pure ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Goal**: Optional layout modes + preview acquisition (**FR-008**, **FR-009**). Defer after P1–P3 if schedule constrained.

**Independent Test**: Toggle list/grid/table without data loss; preview image or placeholder.

### Implementation for User Story 4 (Stretch)

- [ ] T035 `[US4]` Add client-side view mode state (list/grid/table) with persisted preference (start with `localStorage` in `components/links/LinkViewSwitcher.tsx`)
- [ ] T036 `[US4]` Implement alternate layouts reusing existing query data `components/links/LinkGrid.tsx` `components/links/LinkTable.tsx`
- [ ] T037 `[US4]` Add guarded preview fetch route with timeout + neutral placeholder `app/api/link-preview/route.ts` `lib/links/preview.ts`

**Checkpoint**: US4 acceptance optional for first release per spec.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Feature branch**: `008-phase-07-polish` (from `master` after the last merged story branch you ship)  
**Merge**: PR → `master`; all tests/e2e/docs checks green.  
**Testing**: Expand Playwright smoke / a11y checks; **TDD** optional for pure refactors—otherwise add or extend tests **in this branch before PR** so coverage does not regress ([policy](#per-phase-testing-tdd-or-tests-immediately-after)).

**Purpose**: Hardening, docs, optional e2e harness.

- [ ] T038 `[P]` Add Playwright config + smoke spec skeleton (sign-in stub + create link happy path) `playwright.config.ts` `tests/e2e/links-smoke.spec.ts`
- [ ] T039 Walk through [quickstart.md](./quickstart.md) on clean machine; fix discrepancies in `README.md` and/or `quickstart.md`
- [ ] T040 `[P]` Improve form accessibility (labels, focus order) across `components/links/*.tsx` `components/folders/*.tsx` `components/tags/*.tsx`
- [ ] T041 Review empty-state UX for zero links / zero filter matches per edge cases in [spec.md](./spec.md) `components/links/EmptyState.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 → Phase 2 → User Stories → Polish** strictly sequential gating.
- **US2** depends on link CRUD + queries from **US1** (shared models already in Foundational).
- **US3** depends on **US1** + **US2** filter surfaces (folder context + tags interplay).
- **US4** depends on stable list data paths from **US1** (layouts reuse queries).

### User Story Dependencies (summary)

| Story | Depends on |
|-------|------------|
| US1 | Foundational only |
| US2 | Foundational + US1 link persistence/UI |
| US3 | US1 + US2 |
| US4 | US1 (US2/3 optional for visuals but recommended) |

### Parallel Opportunities

- Tasks marked `[P]` within a phase may run concurrently when they touch **disjoint files**.
- After Foundational completes, **US2** server actions (T024–T026) can parallelize with **US1** UI polish if staffing allows—still finish **US1** checkpoint before calling feature MVP done.

### Parallel Example: Foundational

```bash
# After T006–T007 schema lands, run together:
T008  # supabase/policies/rls-links.sql
T010  # lib/auth/supabase-server.ts
T011  # lib/auth/supabase-browser.ts
T016  # lib/validation/*.ts
T017  # vitest.config.ts
```

---

## Implementation Strategy

### MVP (US1 only)

1. Complete Phase 1 + Phase 2 (each via its own branch + PR merge to **`master`**).  
2. Deliver Phase 3 (**US1**) on **`004-phase-03-us1-links`**, then PR merge.  
3. STOP — run Independent Test for story 1; demo/release MVP.

### Incremental delivery

1. **US2**: branch **`005-phase-04-us2-folders`** → PR → `master`.  
2. **US3**: branch **`006-phase-05-us3-tags`** → PR → `master`.  
3. Optionally **US4**: branch **`007-phase-06-us4-layouts-previews`** → PR → `master`.  
4. **Polish**: branch **`008-phase-07-polish`** → PR → `master`.

### Traceability quick map

| Story | Primary FR coverage |
|-------|---------------------|
| US1 | FR-001, FR-002, FR-003, FR-011, FR-014 (overall leg) |
| US2 | FR-004, FR-007, FR-012, FR-015 |
| US3 | FR-005, FR-006, FR-013 |
| US4 | FR-008, FR-009 |
| Foundational / contracts | FR-010 readiness (shared shapes & DB) |

---

## Notes

- Confirm each server mutation uses authenticated `userId` from Supabase session; never trust client-supplied user ids (**FR-003**).  
- Keep duplicate URL confirmation server-authoritative—client only surfaces dialog (**FR-011**).  
- Re-run `prisma migrate dev` whenever `prisma/schema.prisma` changes; mirror RLS SQL separately in Supabase.  
- Commit after each task or coherent batch within the phase branch; stop at any checkpoint to validate story independence—then open the phase PR **only after** automated tests pass on that branch, following **[Per-phase testing](#per-phase-testing-tdd-or-tests-immediately-after)** (red-first when practical; otherwise commit implementation then tests in the same branch before PR).

### For maintainers / agents

**Do not** commit or merge to `master` on the user’s behalf unless they explicitly request it—provide **commit message suggestions** and **PR checklist** wording instead.
