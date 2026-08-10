# SmartGarage

Front-end for a vehicle-repair workshop product — two installable PWAs (**cliente** = customer, **taller** = workshop) on a shared TypeScript spine. Flux/unidirectional state (Zustand), Mantine v7 UI, mock-backed by default so it runs with **no backend**.

pnpm + turbo monorepo. Four packages, two apps.

```
packages/
  contracts/   types, 7-state order machine, Zod schemas, validators, KPIs, mock seed
  api-client/  ApiClient interface + MockApiClient + HttpApiClient + config factory
  store/       Zustand store (session/cliente/taller) + selectors + role/tenant guards
  ui/          Mantine v7 theme + shared components + label maps
apps/
  cliente/      Vite + React PWA — cotizar wizard + order seguimiento
  taller/       Vite + React PWA — dashboard + agenda + órdenes + clientes
```

## Prerequisites

- **Node >= 20**
- **pnpm 9** — enable once via `corepack enable` (the repo pins `packageManager: pnpm@9.12.0`)

## Quick start

```bash
pnpm install            # installs the whole workspace
pnpm --filter @smartgarage/cliente dev   # cliente → http://localhost:5173
pnpm --filter @smartgarage/taller dev    # taller → http://localhost:5174
```

Both apps auto-login a demo session and run entirely on the in-memory mock — no API or database required.

## Scripts

Run from the repo root (turbo orchestrates and builds workspace dependencies in the right order):

| Command | What it does |
|---|---|
| `pnpm build` | Build every package + app (apps emit `dist/` + a PWA service worker) |
| `pnpm typecheck` | `tsc --noEmit` across the workspace |
| `pnpm test` | `vitest run` across the workspace (101 tests; ≥90% coverage on contracts/store/ui) |
| `pnpm dev` | (alias) dev-mode every workspace package — prefer the per-app command above |

Per-package examples:

```bash
pnpm --filter @smartgarage/contracts test -- --coverage
pnpm --filter @smartgarage/taller dev
```

Package names: `@smartgarage/{contracts,api-client,store,ui,cliente,taller}`.

## Mock vs HTTP mode

The front-end talks to one seam (`api-client`). By default it uses `MockApiClient` (the seed data lives in `packages/contracts/src/seed.ts`). To point it at the real backend, set Vite env vars **per app** (e.g. `apps/cliente/.env`):

```
VITE_API_MODE=http
VITE_API_BASE_URL=https://api.smartgarage.dev
```

No component or store change is needed — the factory in `packages/api-client/src/factory.ts` swaps on `VITE_API_MODE`.

## Architecture in one paragraph

Components read selectors and call store actions only; store actions call `api`; `api` is mock-or-http by config. `contracts` is the treaty (types, state machine, Zod schemas, validators, KPI formulas, seed) — everything imports from it, so the mock and the state machine can't drift. The order lifecycle is 7 canonical states (`recibido → … → entregado`); `advance` is a no-op past `entregado`, `presupuesto → aprobado` requires line items. KPIs are derived, never stored. Roles gate actions (`can(role, capability)`); reads are tenant-scoped.

## Tech stack

Node 20 · pnpm 9 · turbo 2 · TypeScript 5.9 (strict) · React 18.3 · Zustand 4 · Zod 3 · Mantine v7 · Vite 5 · vite-plugin-pwa · recharts 2 · react-router-dom 6 (cliente) · Vitest 2 + Testing Library.

## Deploy

Each app is its own Vercel project (Root Directory `apps/cliente` / `apps/taller`; the build runs `pnpm turbo run build --filter=<app>...` to build the app and its workspace deps). Set `VITE_API_MODE` in the Vercel project env. SPA fallback is configured in each app's `vercel.json`.

## CI

`.github/workflows/ci.yml` runs on every push and pull_request: install (frozen lockfile) → typecheck → test → build.
