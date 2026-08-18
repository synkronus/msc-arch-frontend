# U4 — Microfrontend Architecture (Module Federation)

## Decision

**Client-side composition via Module Federation 2.0** (`@module-federation/vite`), chosen over server composition (these are static SPAs/PWAs, no SSR, SEO is not a driver for an authenticated app) and over iframes (they break the shared design system, the shared session, and cross-module messaging; the course reading rates iframe UX integration as *low*). Client composition gives independent deploy **plus** a unified UX.

## Domains (by business capability, not by role)

| Domain | Deployable | Content |
|---|---|---|
| `cliente` | `apps/cliente` (remote) | customer experience: cotización, seguimiento |
| `taller` | `apps/taller` (remote) | workshop ops: inicio, agenda, órdenes, clientes — **all four workshop roles share this one remote** via in-store permissions (`can(role, capability)`) |
| `shell` | `apps/shell` (host) | session, tenant context, global navigation. **No business logic.** |
| `facturacion`, `analitica` | roadmap | shown as disabled nav items only |

The central microfrontend argument: boundaries follow the **domain**, not the role — the four workshop roles live inside one remote, which keeps domain boundaries clean while permissions handle role differences.

## Shared singletons (identical in host and both remotes)

`react`, `react-dom`, `react-router-dom`, `zustand`, `@mantine/core`, `@mantine/hooks`, `@smartgarage/contracts`, `@smartgarage/api-client`, `@smartgarage/store`, `@smartgarage/ui`.

Single React, one Mantine context, one `useApp` store instance across host and remotes → **one session and one theme**. Under pnpm, every shared module must also be a *direct* dependency of each federated app (pnpm only links direct deps; MF resolves shares from the app context).

## Independence with coherence

- **Independence:** three separate Vercel projects, three domains — redeploying a remote never touches the shell (`remoteEntry.js` is served with `Cache-Control: must-revalidate` so redeploys are picked up immediately).
- **Coherence:** the shared, versioned spine (`contracts` as the treaty, `ui` as the design-system singleton, one `store` session) plus a governing shell.
- **Shared state:** session and tenant live in the shell (mock login sets `useApp.session`, taller roles via `setRole`), remotes read the same store.

## Implementation notes (deviations from the original spec, both forced by reality)

1. **Remotes are ESM** — the host declares them with the object form `{ type: "module", name, entry }`. The string shorthand `name@url` defaults to `type: "var"` (classic `<script>`), which throws `Cannot use import statement outside a module` for ESM entries.
2. **The host owns no `BrowserRouter`** — react-router v6 forbids *any* `<Router>` inside another `<Router>`, including `MemoryRouter` inside `BrowserRouter`. The shell therefore drives views with history-synced state (`pushState` + `popstate`), so each remote mounts with no outer Router context and gets its own `MemoryRouter` inside `RemoteMount`.
3. **Shell deployed via Vercel *prebuilt* flow** — `vercel build --prod` locally with the production remote URLs baked in, then `vercel deploy --prebuilt --prod`. This sidesteps the Root-Directory-from-CLI resolution problem that broke an earlier `taller` deploy. The build output was grep-verified to contain the production `remoteEntry.js` URLs before deploying.
4. **`apps/shell/@mf-types/` is a build artifact** — the 16 generated `.d.ts` files the MF plugin emits regenerate on every build and are **not** committed (git-ignored, untracked in `9cc7b06`). `apps/shell/.env.example` is intentionally kept though it is swallowed by the repo-wide `.env.*` gitignore rule — treat `.env.example` as reference, not a tracked file.

## Costs and risks (explicit)

- Bundle duplication → mitigated by shared singletons.
- Over-fragmentation → avoided: two active domains + a shell.
- Added build/deploy complexity is the price of independent delivery — justified by domain autonomy (distinct teams, distinct cadences, future billing/analytics teams).
- PWA × federation: remote service workers are scoped to their own origins and never run inside the shell page.

## Live evidence (all three deployed and verified)

| App | URL | Verified |
|---|---|---|
| shell (host) | https://smart-garage-shell.vercel.app | Browser (Chrome DevTools) — Launcher + nav, 0 console messages |
| cliente (remote) | https://smart-garage-latam.vercel.app | `remoteEntry.js` → `content-type: application/javascript` + `access-control-allow-origin: *` + `must-revalidate` |
| taller (remote) | https://smart-garage-workshop.vercel.app | same as cliente |

**Production browser proof (Chrome DevTools, 0 console errors/warnings across the full flow):**
- Shell loads: Launcher + nav (Cliente / Taller + disabled Facturación / Analítica), "Sin sesión".
- *Entrar como Cliente* → the `cliente` remote mounts **cross-origin** (cotizar wizard, gating intact, shared `CLIENTE · t1` session shown in the host header).
- *Cambiar sesión* → clean logout → *Entrar como Taller (Dueño)* → the `taller` remote mounts (Dashboard, KPIs, chart, 4-tab nav).

Repo: `synkronus/msc-arch-frontend` (`dev` fast-forwarded into `main` at `6b89c83..9cc7b06`; the push auto-redeployed both remotes on Vercel).

Video checklist: (1) the composed shell, (2) each remote live on its own domain, (3) redeploy one remote without touching the shell, (4) shared session across host and remote.
