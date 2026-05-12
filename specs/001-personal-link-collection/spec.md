# Feature Specification: Personal Link Collection

**Feature Branch**: `001-personal-link-collection`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: A link-storage application: an authenticated user creates link entries (URL, title, optional description); creates folders and assigns links to folders; assigns tags to links; optional future capabilities include preview images and alternate viewing modes (grid, table). Initial releases target a web client; separate mobile or messenger clients are out of the first delivery scope, but the product should remain extensible. The sponsor’s technology baseline for the first version will be recorded in the implementation plan document.

## Clarifications

### Session 2026-05-12

- Q: Can the same URL appear in multiple entries for one user? → A: Yes; when saving, if that URL already exists in the user’s collection, an explicit warning is shown; after confirmation a separate entry is created.
- Q: Should folder and tag names be unique within one account? → A: Folder names are unique among that user’s folders; tag names are unique among that user’s tags; the same string may be both a folder name and a tag name.
- Q: When both folder and tag filters are active, how is the list narrowed? → A: Only links that are **both** in the selected folder **and** carry the selected tag are shown.
- Q: How should links be sorted by default in the overall list versus inside a selected folder? → A: **Overall** browsing (no selected folder constraining the list) — **newest to oldest** by time the link entry was added to the collection. When the context is **one specific folder** (including folder **and** tag with intersection semantics) — order is **alphabetical by title**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Save and manage links (Priority: P1)

As an authenticated user, I want to save web links with a clear title and optional description so I can quickly return to what I need from one place.

**Why this priority**: Without saving and viewing links, the product does not deliver its core value.

**Independent Test**: After signing in, the user adds a link and sees it in the list; can edit title, description, target URL, and delete an entry.

**Acceptance Scenarios**:

1. **Given** the user is signed in, **When** they save a new link with required fields (URL and title), **Then** the entry appears in their collection and is visible only to them.
2. **Given** the user has a saved link, **When** they edit the title or description, **Then** changes persist and appear on next open.
3. **Given** the user has a saved link, **When** they delete it, **Then** it disappears from the collection and no longer displays.
4. **Given** the user is not authenticated, **When** they try to open link management, **Then** the system does not show their data and prompts them to sign in.
5. **Given** the user already has an entry with a given page address, **When** they save a new entry with the same address (or change an existing entry’s address to one already used by another entry), **Then** the system shows an explicit duplicate-URL warning; if the user confirms, a separate entry is saved or the entry is updated; if they cancel, the prior persisted state remains without saving a duplicate the user discarded.
6. **Given** the user is viewing the collection in the **overall** layout **without a selected-folder constraint** (all account entries, not scoped to “one folder”), **When** they save two entries one after another, **Then** the later-added entry appears **above** the earlier-added one in this overall view.

---

### User Story 2 — Organize links in folders (Priority: P2)

As a user, I want to create folders and place links into folders so I can structure my collection by topic or project.

**Why this priority**: Folders reduce overload as link count grows and make navigation predictable.

**Independent Test**: Exercised by creating folders, moving a link between folders, and filtering the list by folder without relying on tags.

**Acceptance Scenarios**:

1. **Given** the user is signed in, **When** they create a folder with a name, **Then** the folder appears in their space empty until links are added.
2. **Given** a folder exists and a link has no folder (or is in another folder), **When** the user assigns a folder to the link, **Then** the link appears inside that folder in folder-focused views.
3. **Given** a link is inside a folder, **When** the user removes the folder or moves it to another folder, **Then** displayed placement matches the new location.
4. **Given** a folder has no links, **When** the user deletes the folder, **Then** the folder deletes without error.
5. **Given** a folder contains links, **When** the user tries to delete the folder, **Then** deletion is blocked with an explanation; after the user moves or removes every link from the folder, deleting the folder becomes available again.
6. **Given** the user already has a folder under a given name, **When** they create or rename another folder to that same name (after agreed string comparison rules), **Then** the system rejects the duplicate and states that folder already exists.
7. **Given** the user opens the contents of **one** selected folder (the link list is limited to that folder), **When** several entries have different titles, **Then** they display **sorted alphabetically by title** according to rules in the implementation plan; when multiple entries share the **same** title, ordering remains **stable** using a secondary rule from the plan (e.g. time added or identifier).

---

### User Story 3 — Tag links and narrow the list (Priority: P3)

As a user, I want to assign tags to links and filter the list by tag so I can find related material.

**Why this priority**: Tags add flexible classification on top of folders and speed retrieval.

**Independent Test**: Create tags; assign multiple tags to one link; filter by tag.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they create a tag with a name, **Then** the tag is available for assignment to their links.
2. **Given** a link and tags exist, **When** the user assigns one or more tags to a link, **Then** viewing the link shows all assigned tags.
3. **Given** the user has many links, **When** they choose one tag in the filter, **Then** only links that have that tag are shown.
4. **Given** the user already has a tag under a given name, **When** they create or rename another tag to that same name (after agreed string comparison rules), **Then** the system rejects the duplicate and states that tag already exists.
5. **Given** links live in different folders with different tags, **When** the user selects one specific folder and one specific tag in the filters, **Then** only links that are simultaneously in that folder and carry that tag are shown.

---

### User Story 4 — Richer browsing: previews and layouts (Priority: P4)

As a user, I want to optionally browse the collection as a preview card grid or a table so I can recognize sites faster with visual cues.

**Why this priority**: Improves experience for large collections but is not mandatory for first release.

**Independent Test**: Switch display modes; for previews—a thumbnail appears or a placeholder when preview is unavailable.

**Acceptance Scenarios**:

1. **Given** the user is browsing the collection, **When** they switch among list, grid, and table modes, **Then** the same entries render in the selected layout without data loss.
2. **Given** previews are enabled, **When** the system successfully obtains an image for a link, **Then** the user sees a preview in supported modes.
3. **Given** preview is unavailable for technical reasons on the source site, **When** the user enabled previews, **Then** a neutral placeholder is shown without breaking the screen.

---

### Edge Cases

- Invalid or unreachable URL when saving: clear messaging; UI remains usable.
- Very long titles and descriptions: truncation or wrapping without breaking layout.
- Session ends while editing: the user understands they must sign in again; unsaved changes are lost in a predictable way or they are prompted to save first.
- A folder name and tag name sharing the same display text are allowed; the UI still distinguishes folder vs tag. Two folders with the same name for one user—or two tags with the same name—are forbidden with a clear refusal message.
- The same URL in multiple entries for one user is allowed with an explicit pre-save warning; the user confirms or cancels; entries differ by title, folder, tags, and record identity.
- Both filters (folder and tag) enabled: an empty result is valid when nothing matches the intersection; the UI MUST stay stable and clear (for example, a neutral “no matches” state).
- Switching between overall browsing and browsing within one folder changes ordering rules—chronological **versus** alphabetical—without confusing errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST require authentication before access to collection data and operations.
- **FR-002**: Users MUST be able to create, read, update, and delete link entries with fields: target page URL, title, optional description.
- **FR-003**: One user’s data MUST be isolated from other users’ data.
- **FR-004**: Users MUST be able to create named folders and assign at most one folder per link, or leave a link outside any folder.
- **FR-005**: Users MUST be able to create tags and assign zero or more tags per link.
- **FR-006**: Users MUST be able to filter the link list by selected folder and by selected tag; if **both** folder and tag are selected, results MUST intersect (logical **AND**); selecting only folder or only tag MUST apply exactly that criterion.
- **FR-007**: Deleting a folder MUST be forbidden while at least one link remains inside it; the system MUST explain why and advise moving or unassigning links; once the folder is empty, deletion MUST succeed.
- **FR-008**: A later enhancement (beyond the initial mandatory slice) SHOULD add switchable layouts—list, card grid, table—without changing the logical data model.
- **FR-009**: A later enhancement SHOULD include optional previews for links with stable behavior when images are unavailable.
- **FR-010**: The product MUST design its public data-and-operations surface so independent clients (native app or messenger mini-client) may be added later without rewriting the core collection model; such clients remain out of mandatory early releases.
- **FR-011**: When creating a link entry or changing its URL, if **another** entry for the same user already targets the same page URL (per normalization rules in the implementation plan), the system MUST show an explicit warning before persisting changes; after explicit user confirmation saving MUST succeed; after canceling the warning previously saved data MUST remain unchanged.
- **FR-012**: Within one account, folder names MUST be unique across that user’s folders under agreed normalization rules from the implementation plan; creating or renaming a folder to a name already used by another folder MUST fail with a clear message.
- **FR-013**: Within one account, tag names MUST be unique across that user’s tags under the same normalization rules; creating or renaming a tag to a name already used by another tag MUST fail with a clear message.
- **FR-014**: In **overall-collection** browsing where no **folder filter** applies—i.e., “all links without scoped-to-one-folder semantics” per UI wording in the plan—the user’s link list MUST sort so newer **by time-of-addition** entries appear above older ones; when only a **tag** filter is active with **no folder** filter (if supported), the same **chronological** ordering as overall collection MUST apply.
- **FR-015**: When the UI context is **one specific selected folder** (list constrained to that folder), including combined **folder + tag** filtering per **FR-006**, ordering MUST be **alphabetical by entry title** per locale collation rules from the plan; ties on title MUST resolve with a **stable** secondary key from the plan (e.g. time added or identifier).

### Key Entities *(include if feature involves data)*

- **User**: Owns exactly one private collection workspace; identity is handled by external sign-up/sign-in; cannot see other users’ data.
- **Link**: An item in the collection: page URL, title, optional description; optional visual preview derived for display only; belongs to exactly one user; multiple entries MAY share one URL after the user acknowledges a duplicate warning.
- **Folder**: Named container in the user’s space; name unique among folders (may coincide with a tag string); ordering is user-visible; modeled so a link has at most one parent folder.
- **Tag**: Short classification label; name unique among tags (may coincide with a folder name); many-to-many relationship with links in one user’s space.
- **View and filters**: Not a persisted entity—the same logical link set filtered by folder and/or tag (AND when both selected), selectable layouts, and **default sort rules**: overall browsing without folder scoping sorts newest-first; single-folder scoped browsing sorts alphabetical by title (see **FR-014**, **FR-015**).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After successful authentication, a typical user completes adding their **first** new entry in under **two minutes** from an **empty-collection** screen to a saved visible link **without needing help documentation**.
- **SC-002**: At least **95%** of save attempts under stable network—with valid mandatory fields supplied—complete successfully.
- **SC-003**: After storing at least **100** links across **15** folders, knowing folder or tag, the user retrieves a designated link within **30 seconds average** on a scripted test scenario **without resorting to the open web**.
- **SC-004**: After grid/table modes ship, switching layout preserves all saved entry fields versus the saved state immediately before switching.
- **SC-005**: Acceptance-preview participants rate the save-and-return flow understandable on **first acquaintance** at agreement **≥ 4 out of 5** (survey after brief onboarding).

## Assumptions

- One credential maps to one private collection space; cross-account folder sharing is not required for the first slice.
- Previews and alternate layouts may arrive in follow-on iterations after P1–P3 basics.
- Native mobile and messenger-class clients fall outside mandatory first release capability, but modeling and APIs should not prohibit adding them later.
- Specific products/libraries for web v1 are captured elsewhere (linked plan artifact) and are **not acceptance criteria for** the user-facing scenarios herein.
- A dedicated full-text search box across fields is optional for first release when folder/tag filters suffice.
