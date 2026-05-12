# API & Data Contracts (v1 Draft)

Purpose: stabilize **cross-client** payloads for the personal link manager while the first implementation ships inside a **Next.js** monolith (**Server Actions** or Route Handlers). Mobile or Telegram clients envisioned in **FR-010** SHOULD reuse these shapes verbatim.

Artifacts:

| File | Description |
|------|-------------|
| [openapi.yaml](./openapi.yaml) | Draft OpenAPI **3.1** document describing REST-aligned resources mirroring server validation rules. Paths are illustrative until route handlers expose them publicly. |

> Authentication: all operations assume a bearer token or cookie session resolving to **`userId`** enforced by middleware + Postgres RLS (see research).
