# ESLint, TypeScript, and formatter pins

This note records **why** specific major versions are pinned at the repo root and what to redo when upgrading.

## Current pins (check root [`package.json`](../package.json))

| Package | Pin (approx.) | Role |
|---------|----------------|------|
| **ESLint** | **^9.39.x** | Flat-config runner for the whole monorepo (see [`eslint.config.mjs`](../eslint.config.mjs)). |
| **eslint-config-next** | matches **Next 16.x** (`16.2.6` today) | React + Core Web Vitals + Next rules scoped to `apps/next/**`. |
| **typescript-eslint** | **^8.59.x** | TypeScript parsing and recommended rules for non-Next workspaces and shared stacks. |
| **Prettier** | **^3.8.x** | Formatting; integrated via `eslint-plugin-prettier` recommended preset. |

The web app [`apps/next/package.json`](../apps/next/package.json) uses **TypeScript 6.0.3** (tooling for the Next workspace). That is independent of the ESLint major; `typescript-eslint@8` supports TypeScript 6.x within its declared peer range.

## Why we stay on ESLint 9 (not 10)

**ESLint 10** removes/changes **RuleContext** APIs (for example the old `context.getFilename()` pattern). The **`eslint-plugin-react`** version pulled in by **`eslint-config-next@16`** (7.37.x line) still expects the ESLint 9-style context. With ESLint 10 this produced runtime errors such as:

`TypeError: contextOrFilename.getFilename is not a function`

while linting normal App Router files (for example `app/layout.tsx`).

`eslint-config-next` declares `peerDependencies.eslint: '>=9.0.0'`, so ESLint 10 is allowed by the peer range, but the **React plugin stack is not yet reliably compatible** on that combination for our preset.

## When to move to ESLint 10 (checklist)

Revisit this section after **stable** releases land; do not upgrade on pre-releases without a deliberate spike.

1. **Upstream guardrails**
   - **`eslint-plugin-react`**: `npm view eslint-plugin-react peerDependencies` includes **ESLint 10** (or release notes explicitly support v10).
   - **`eslint-config-next`**: release notes or changelog mention **ESLint 10** support and bump the bundled / requested `eslint-plugin-react` appropriately.

2. **Local verification (from repo root)**

   ```bash
   npm install
   npm run lint
   npm run db:generate -w @next16-links/web
   npm run build -w @next16-links/web
   ```

3. **If you must upgrade before Next ships it**
   - Prefer waiting for **`eslint-config-next`** to catch up.
   - Only then consider **`overrides`** in root `package.json` to force a newer `eslint-plugin-react`, after reading its release notes and testing the full lint graph.

After a successful ESLint 10 upgrade, shorten or remove this document’s “stay on 9” section and refresh the table above.
