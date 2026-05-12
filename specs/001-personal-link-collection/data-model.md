# Data Model: Personal Link Collection

Source spec entitles: User, Link, Folder, Tag relationships with filters & sorting clarified (see `spec.md` **FR**/**Clarifications**).

## Entities

### `User`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid PK` | Mirror `auth.users.id` (**Supabase**). Creation via trigger or signup hook (implementation detail). |

No cross-user visibility fields in v1.

---

### `Folder`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid PK default gen_random_uuid()` | |
| `userId` | `uuid FK → User(id)` ON DELETE CASCADE | Ownership |
| `name` | `text NOT NULL` | Unique among folders per user (**FR-012**); collation matches plan |
| `createdAt` | `timestamptz default now()` | Auditing/UI optional |

**Constraints**: Unique `(userId, normalizedNameCandidate)` enforced via normalized column or CI unique index pending migration strategy (`citext` optional).

---

### `Tag`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid PK default gen_random_uuid()` | |
| `userId` | `uuid FK → User(id)` ON DELETE CASCADE | |
| `name` | `text NOT NULL` | Unique among tags per user (**FR-013**) |

---

### `Link`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid PK default gen_random_uuid()` | |
| `userId` | `uuid FK → User(id)` ON DELETE CASCADE | |
| `url` | `text NOT NULL` | Original submitted string (display + edit) |
| `urlNormalized` | `text NOT NULL` | Canonical form for comparisons (**FR-011**) |
| `title` | `text NOT NULL` | |
| `description` | `text NULL` | |
| `folderId` | `uuid NULL FK → Folder(id) ON DELETE RESTRICT` | At most one folder (**FR-004**); Folder rows **cannot delete** until empty (**FR-007**) |
| `createdAt` | `timestamptz default now()` | Drives newest-first (**FR-014**) |
| `updatedAt` | `timestamptz default now()` | Maintain via trigger/`@updatedAt` |

**Relations**:

- Folder optional; deleting folder forbidden while links remain per **FR-007** (enforce in app BEFORE DB restrict if FK mode differs—prefer `ON DELETE RESTRICT` on folder deletion when rows exist).

**Duplicate policy**: Multiple rows MAY share same `urlNormalized`; warning flow before insert/update vs other ids.

---

### `LinkTag` (join)

| Field | Type | Notes |
|-------|------|-------|
| `linkId` | `uuid FK → Link ON DELETE CASCADE` | |
| `tagId` | `uuid FK → Tag ON DELETE CASCADE` | |

**Constraints**: Composite PK `(linkId, tagId)`; cascading deletes tidy assignments.

---

## Validation mapping (requirements)

| Requirement | Enforcement |
|-------------|-------------|
| **FR-001** | Routes gated by authenticated session server-side |
| **FR-002** | Required `url`/`title`; optional description |
| **FR-003** | RLS `user_id` + queries always scoped |
| **FR-004** | `folderId` scalar nullable FK |
| **FR-005** | Join rows only |
| **FR-006/007** intersection | Filters combine with AND SQL |
| **FR-007** | Delete folder transactional check `count(*) = 0` OR restrict FK |
| **FR-011** | Warning query `exists same user different id same urlNormalized` |
| **FR-012/013** | Unique partial indexes scoped by user |
| **FR-014/015** | Query `orderBy` per context |

---

## State transitions

- **Link lifecycle**: Created → editable fields → deleted.
- **Folder lifecycle**: Empty → optionally filled → deletion only when zero children links.
- **Tag lifecycle**: Create/rename respecting uniqueness → delete cascades junction rows.

