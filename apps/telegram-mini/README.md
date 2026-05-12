# Telegram Mini App (placeholder workspace)

When you implement the Mini App phase:

1. Replace this package with **Vite + React TS** or **Vue TS** (`npm create vite@latest . -- --template react-ts`).
2. Call the **same HTTPS API** as the web client (Route Handlers in **`apps/next`** / workspace `@next16-links/web`).
3. On the server Next side, validate **Telegram `initData`** (HMAC with bot token) before issuing tokens or attaching a user id.

Keeping this as its own npm workspace avoids coupling the Mini App bundle to the Next webpack/turbopack graph.
