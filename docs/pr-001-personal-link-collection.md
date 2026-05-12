# Pull Request: `001-personal-link-collection` → `master`

Use this file as a **draft for the GitHub/GitLab PR description**. Copy the sections below into the PR body and adjust bullets if anything else landed on the branch.

## Metadata

| Field | Value |
|--------|--------|
| **Source branch** | `001-personal-link-collection` |
| **Target branch** | `master` |
| **Change type** | Speckit documentation + delivery workflow (no Next.js application code until the separate **`002`…`008`** phases) |

## Suggested PR titles

```
docs: Personal Link Collection — spec, plan, tasks, phased branches
```

or shorter:

```
docs(specs): link collection Speckit artifacts and delivery workflow
```

## PR description (body)

### Purpose

Land in **`master`** the **Personal Link Collection** feature artifact set and aligned delivery rules: implementation phases, branch names, merge via PR, and testing policy (TDD preferred, otherwise automated tests added immediately after implementation in **the same phase branch**, before opening the PR).

### What this branch is expected to contain

Specification and planning live under:

- `specs/001-personal-link-collection/spec.md` — requirements, scenarios, FR-001…FR-015  
- `specs/001-personal-link-collection/plan.md` — technical context, repository layout, **delivery branching**  
- `specs/001-personal-link-collection/research.md`, `data-model.md`, `quickstart.md`, `contracts/` — Phase 0–1  
- `specs/001-personal-link-collection/tasks.md` — phased tasks, **branches `002-phase-01-setup` … `008-phase-07-polish`**, TDD / tests-after, merge criteria  

Also:

- `specs/001-personal-link-collection/checklists/requirements.md` — spec quality checklist  
- If applicable: `.cursor/rules/specify-rules.mdc` pointing at this feature plan  

> Application implementation **does not** have to be in this PR; code ships from separate **`002`…`008`** branches per [tasks.md](../specs/001-personal-link-collection/tasks.md).

### Out of scope for this PR

- Production Next.js / Prisma / Supabase code across phases — separate PRs from `002`…`008`.  
- Merging without your local checks (lint / markdown / CI when configured).

### How to review

- [ ] Cross-links among `plan.md`, `tasks.md`, and `spec.md` stay consistent.  
- [ ] `tasks.md` lists **`002`–`008`** branch names per phase and the per-phase testing policy.  
- [ ] `plan.md` states merges to `master` via PR and tests in-branch per phase policy.  
- [ ] No secrets committed (`.env` not tracked).  

---

## Pre-merge checklist

- [ ] `git diff master...HEAD` reviewed; expect primarily files under `specs/001-personal-link-collection/` and optionally `docs/`.  
- [ ] No conflicts with `master` (or conflicts resolved deliberately).  
- [ ] CI is green (if enabled).  
- [ ] After merge: next coding work starts from **`002-phase-01-setup`** off updated `master` (see [tasks.md](../specs/001-personal-link-collection/tasks.md)).

---

## Quick PR setup from CLI (example)

```bash
git push -u origin 001-personal-link-collection
# Then open compare against master on your host and paste the text from the sections above.
```

Whenever the list of files on the branch changes, update **What this branch is expected to contain** in this document and copy into the PR description again.
