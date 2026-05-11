<!--
Sync Impact Report
- Version: (unversioned template) → 1.0.0
- Principles: Established I–V (no renames; prior file was placeholders only)
- Added: Core Principles I–V; Technology & Stack Discipline; Speckit Workflow & Artifacts
- Removed: None (template placeholders replaced)
- Templates: .specify/templates/plan-template.md ✅ updated (Constitution Check gates)
- Templates: .specify/templates/spec-template.md ✅ reviewed (no mandatory section changes)
- Templates: .specify/templates/tasks-template.md ✅ reviewed (no structural changes)
- Follow-up: None
-->

# Next16 Links Constitution

## Core Principles

### I. Spec-First Delivery

Every feature scope MUST originate from an approved `spec.md` under
`/specs/[###-feature-name]/` before implementation work begins. Plans (`plan.md`)
and tasks (`tasks.md`) MUST trace explicitly to user stories and functional
requirements in that spec. Rationale: Specs are the authoritative agreement on
behavior; skipping them produces rework and untestable scope.

### II. Artifact Traceability

User stories MUST keep stable identifiers and priorities (P1, P2, …). Task
descriptions MUST reference the owning story (for example US1) and, when
applicable, requirement IDs (for example FR-001). Plan summaries MUST restate
the primary requirement and technical approach drawn from the spec. Rationale:
Traceability makes reviews, audits, and incremental delivery verifiable.

### III. Constitution Gates in Planning

The Constitution Check section in `plan.md` MUST be completed before Phase 0
research and re-checked after Phase 1 design. Any non-compliance MUST be listed
in Complexity Tracking with justification; silent violations are forbidden.
Rationale: Governance rules only work when violations are visible and
deliberate.

### IV. Testable Acceptance

Each user story MUST include Independent Test and Acceptance Scenarios that an
implementer can execute without relying on unfinished stories. Where the spec
demands automated tests, tasks MUST schedule failing tests before implementation
(red-green). Where the spec omits automation, verification MUST still map to
those acceptance scenarios. Rationale: Stories that cannot be tested cannot be
shipped safely.

### V. Simplicity and Explicit Clarification

Implementations MUST prefer the smallest design that satisfies the spec (YAGNI).
Unknowns MUST be marked with `NEEDS CLARIFICATION` in the spec or resolved via
the clarify workflow—not assumed in code or plans. Rationale: Hidden assumptions
become production defects.

## Technology & Stack Discipline

The Technical Context block in `plan.md` MUST state language, primary
dependencies, storage, testing tools, and target platform, or mark items as
`NEEDS CLARIFICATION` when unknown. When application code exists in this
repository, plans and tasks MUST follow the layout and conventions recorded
there; until then, agents MUST not invent a stack beyond what the spec and repo
evidence support. Rationale: Plans drive consistent implementation; fabricated
stack details misroute work.

## Speckit Workflow & Artifacts

Feature work MUST use Speckit commands and paths: specifications, plans, research,
data models, contracts, quickstarts, and tasks live under
`/specs/[###-feature-name]/` as defined by the templates. Branch naming MUST
follow project Speckit or extension conventions (for example sequential feature
branches). Git hooks and extensions configured in `.specify/extensions.yml`
MUST be respected when executing Speckit workflows. Rationale: Uniform artifact
layout keeps automation, agents, and humans aligned.

## Governance

This constitution supersedes ad-hoc practices when they conflict. Amendments MUST
update `.specify/memory/constitution.md`, bump `CONSTITUTION_VERSION` using
semantic versioning (MAJOR for incompatible governance or principle removals;
MINOR for new principles or materially expanded guidance; PATCH for wording and
non-semantic fixes), set `LAST_AMENDED_DATE` to the amendment date, and
propagate changes to dependent templates when checks or constraints change. Pull
requests and reviews MUST verify compliance with these principles or document
justified exceptions in plan Complexity Tracking. Runtime editor guidance in
`.cursor/rules/specify-rules.mdc` remains complementary: it MUST not contradict
this document.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
