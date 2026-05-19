# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## The three-repo picture

This repo is one of three siblings under `/home/adm1n/projects/univer/`. The frontend has zero standalone domain knowledge — everything it shows comes from the Laravel backend, which in turn shares a database with the legacy Yii2 system.

| Path | Stack | Role |
|---|---|---|
| `../univer/` | Yii2 (PHP 7.2 era) | **Legacy source-of-truth**, still in production. Owns the schema; defines the permission vocabulary (`e_admin_resource.path`). When the backend's behavior is ambiguous, the Yii2 controller is the ground truth. |
| `../univer-back/` | Laravel 12 | **The API this frontend talks to.** Provides JWT auth (3 guards), Yii2-compatible permissions, and a `{success, data, message}` envelope that `src/lib/api/client.ts` auto-unwraps. |
| `./` (univer-front) | React 19 + Vite 7 + TS 5.9 (strict) + Zustand + react-query 5 + Tailwind 4 + shadcn-ui + react-router 7 + i18next + sonner + Sentry | **The sole frontend** for all four roles (admin, employee, teacher, student). |

**Cross-cutting invariants** — violating any of these breaks production:

1. **The Axios interceptor (`src/lib/api/client.ts`) auto-unwraps the Laravel `{success, data}` envelope** and rejects with `Error` when `success: false`. Components see only the unwrapped payload. Don't add a second unwrap layer in services; don't bypass the interceptor with raw `fetch`.
2. **Permissions are dotted resource strings** (`student.view`, `teacher.*`, `hemis.sync`) with `*` wildcard support. Same vocabulary used in the backend's `permission:` middleware and the Yii2 `e_admin_resource.path` rows. Don't invent a different format on the client.
3. **The JWT payload carries `permissions[]`.** `src/stores/auth/permissionStore.ts` decodes it client-side for UI gating. This is **UX only** — the backend re-checks every request. Never treat client-decoded permissions as security; never short-circuit a server call because "the JWT says they can't."
4. **Module folders mirror backend controller folders.** `src/modules/{admin,teacher,student,employee,shared}/` matches `app/Http/Controllers/Api/V1/{Admin,Teacher,Student,Employee,Compatibility}/` on the backend side. Adding a page here without a corresponding backend endpoint is a smell — check first.
5. **Yii2 compatibility URLs are still live** on the backend (`/api/v1/education/*`, `/api/v1/student/decree`). When you wire a new feature, prefer the canonical `/api/v1/<role>/...` routes unless you have a reason to use the compat surface.

## Common commands

```bash
yarn install                # uses Yarn 4.10.3 (Berry) — do NOT switch to npm/pnpm
yarn dev                    # Vite dev server on http://localhost:3000 (host: true)
yarn build                  # production build → dist/  (terser, drops console+debugger)
yarn preview                # serve the production build locally
yarn lint                   # eslint .  (flat config in eslint.config.js)
yarn type-check             # tsc --noEmit  (strict mode, no emit)

# Tests (Vitest + jsdom + @testing-library)
yarn test                   # watch mode
yarn test:run               # one shot
yarn test:ui                # @vitest/ui
yarn test:coverage          # v8 coverage to coverage/

# Single test file
yarn vitest run path/to/file.test.tsx
yarn vitest run -t "renders dashboard"
```

Node `>=20.19.0 || >=22.12.0`. Yarn is declared in `package.json` `packageManager` — corepack will pick it up automatically.

## Architecture

### Folder layout (the parts that aren't obvious)

```
src/
  modules/                role-scoped pages, mirrors backend role split
    {admin,teacher,student,employee,shared}/pages/
  components/
    ui/                   shadcn-ui primitives (don't hand-write replacements)
    auth/                 ProtectedRoute, RequirePermission
    layouts/              MainLayout, AuthLayout
    common/               cross-feature widgets
  services/               typed API services, extend BaseApiService (see services/README.md)
    {teacher,student,admin,shared}/<Name>Service.ts
    base/BaseApiService.ts
  lib/
    api/                  thin raw fetchers + axios client + security headers
    utils.ts              cn(), formatDate, formatCurrency, getGradeColor, ...
  hooks/
    api/{teacher,student,admin}/   re-export barrel for react-query hooks
    use<Feature>.ts                actual react-query hooks (queries + mutations)
  stores/                 Zustand stores (auth split into 3, plus menu, language, theme)
  config/api.ts           API_CONFIG, API_BASE_URL
  locales/{uz,oz,ru,en}.json     i18n resources
  i18n.ts                 i18next init
  utils/logger.ts         dev-only console wrappers (use this, not console.log)
  test/setup.ts           Vitest setup, mocks sessionStorage
```

**`src/pages/` is dead code.** It's excluded by both `tsconfig.json` and `eslint.config.js`. Don't add files there; use `src/modules/<role>/pages/`.

### API services and hooks

There are **two layers** between components and the backend, and they exist for different reasons:

1. **`src/services/<role>/<Name>Service.ts`** — typed class extending `BaseApiService` (basePath + `get/post/put/patch/delete` helpers). Use this when you want a strongly-typed method that returns DTOs. The `services/README.md` explains the pattern. Singletons exported from `services/index.ts`.
2. **`src/hooks/<useFeature>.ts`** — react-query wrappers. Each hook file owns its `queryKeys` object (e.g. `testKeys` in `useTests.ts`). Pattern: query hook → `useQuery({ queryKey, queryFn: () => service.method() })`; mutation hook → `useMutation` + `queryClient.invalidateQueries({ queryKey })` + `toast.success/error`.

When adding an API call: write the service method first (or extend `src/lib/api/<feature>.ts` raw fetcher), then expose a hook in `src/hooks/`, then consume the hook in the page. Don't call `apiClient` directly from components.

`QueryClient` defaults (in `main.tsx`): `staleTime: 5min`, `refetchOnWindowFocus: false`, `retry: 1`. Don't override globally; do it per-query when you have a reason.

### Auth and permission stores

Split into three single-responsibility Zustand stores (`src/stores/auth/`):

- **`authStore`** — `login()`, `logout()`, `refreshToken()`, holds `token`/`isAuthenticated`/`loading`/`error`. **Tokens live in `sessionStorage`** (`access_token`, `refresh_token`, `user_type`) — closing the tab logs the user out. Don't move them to `localStorage` (sensitive token in long-lived storage was an explicit rejection).
- **`userStore`** — current user, `fetchCurrentUser()`, role/profile state.
- **`permissionStore`** — `getJWTPermissions()`, `isTokenValid()`, `canAccessPath(path)`, `refreshPermissionsInBackground()`. Decodes the JWT and returns the permission array; falls back to logging the user out when expired.

There's **one known inconsistency**: `useAuthInit` reads `localStorage.getItem('access_token')` on boot while `authStore` writes to `sessionStorage`. The boot path is effectively dead for new sessions — actual session restore happens through the persisted Zustand `auth-storage` key. Don't "fix" it by switching `useAuthInit` to sessionStorage without checking whether anything else still relies on a `localStorage` token (legacy code in `lib/api/client.ts` previously read from `sessionStorage` after a migration).

### Route protection — three layers

`src/components/auth/ProtectedRoute.tsx` composes:

1. `allowedRoles` — frontend-only UX check (F12-bypassable, do not treat as security).
2. `permission` — name like `student.view`. Checked against the JWT-decoded list.
3. `resourcePath` — Yii2-style path like `structure/faculties`. Checked via `menuStore.canAccessPath()` which mirrors `e_admin_resource.path`.

The first hit wins for redirect. For conditional UI (buttons, menu items) use `<RequirePermission permission="student.create">`. Both support `*` wildcards.

### Localization

- 4 locales: `uz` (Latin Uzbek, default), `oz` (Cyrillic Uzbek), `ru`, `en`. Files in `src/locales/`.
- `i18next` + `react-i18next` + browser language detector (`localStorage` → `navigator` → `htmlTag`).
- The backend expects locale via `X-Locale` header (short code: `uz`/`oz`/`ru`/`en`) and `Accept-Language`. `languageStore` sets both on the axios instance. Some Yii2-format endpoints still accept `?l=uz-UZ` query params — backend's `SetLocale` middleware normalizes either form.
- Dates/numbers: prefer the locale-aware helpers in `src/lib/utils.ts` (`formatDate`, `formatCurrency`, `formatDateTime`) — they hardcode `uz-UZ` today, which is a known gap when displaying in other locales. If you fix it, fix it once in `utils.ts`.

### Styling

- **Tailwind v4** (PostCSS plugin in `postcss.config.mjs`, `@tailwindcss/postcss`). v4 has different config conventions from v3 — check the `tailwind.config.ts` `theme.extend.colors` before referencing new tokens.
- Semantic color tokens are domain-named: `primary` (government blue), `accent` (state gold), `medical`, `math`, `code`, `philosophy`, `success`, `error`. Use these instead of raw Tailwind palette colors so theming stays consistent.
- `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.
- shadcn-ui primitives in `src/components/ui/`. **Don't reimplement** — extend or compose. New shadcn primitives go in this folder.
- Dark mode is `class`-based (`darkMode: 'class'`); toggled via `themeStore`.

### Notifications and errors

- **Toasts: `sonner`** (`import { toast } from 'sonner'`), already mounted in `main.tsx` (bottom-right, rich colors). Do not install or use shadcn's `toast` — sonner is the choice.
- **Error boundary**: `SentryErrorBoundary` wraps the whole tree. Per-feature local boundaries can use `ErrorBoundary.tsx`.
- **API errors**: thrown by the axios interceptor when `success: false`. Either let react-query surface them, or extract with `getErrorMessage(err)` from `src/lib/utils/error.ts`.
- **Logging**: `src/utils/logger.ts` — `logger.debug/info` are dev-only; `logger.warn/error` always log. Use these instead of bare `console.*` so production builds stay clean (terser drops `console.*` anyway, but use the wrapper for intent).

### Observability

`main.tsx` initializes Sentry only when `VITE_SENTRY_DSN` is set and `import.meta.env.PROD`. Includes browser tracing, session replay (text masked, media blocked), react-router v7 integration. `tracesSampleRate` / `replaysSessionSampleRate` are env-tunable. Don't lower the masking in replay integration without security review.

## Build and CI nuances

- `vite.config.ts` runs **terser** with `drop_console: true` and `drop_debugger: true` in production. Don't ship debug logging; assume console calls will be stripped.
- Production builds **disable sourcemaps** (security). For Sentry symbol resolution, upload sourcemaps via the Sentry CLI in CI rather than re-enabling them.
- `eslint.config.js` is flat config (ESLint 9). `@typescript-eslint/no-explicit-any` is **warn, not error**, but new code should avoid `any` — match the existing style. Unused vars/args starting with `_` are allowed.
- TypeScript is **strict** but `noUnusedLocals` / `noUnusedParameters` are off — ESLint catches those instead.

## Things that have surprised past contributors

- `*PageNew.tsx` / `*PageCompact.tsx` / `*_REFACTORED.tsx` files live alongside originals during in-progress refactors. Routes in `App.tsx` point at the active one; don't delete the others without checking imports across all 5 modules.
- `authStore.ts.OLD` in `src/stores/` is intentionally retained — don't grep-purge `.OLD` files.
- `src/pages/` is excluded from TS+ESLint. New work goes in `src/modules/<role>/pages/`.
- The frontend Sentry config blocks events with `404` in the message. Don't rely on Sentry for 404 alerting.
- Backend rate-limit responses (429) return `retry_after` in seconds — surface this in the UI (`toast.error(\`...\${err.response.data.retry_after}s...\`)`) rather than silently retrying; react-query is set to `retry: 1`.
- `text/dates` use `'uz-UZ'` Intl locale everywhere in `lib/utils.ts` regardless of UI language. This is a known limitation; when fixing, accept the user's locale as a parameter rather than reading from `i18next` at call sites.

## Project-scoped skills

Workflow skills for recurring frontend tasks live in `.claude/skills/`:

- `add-role-page` — scaffold a new page under `src/modules/<role>/pages/`, hook it into `App.tsx` routes, gate it with `ProtectedRoute` + the right permission string.
- `add-api-feature` — add a service method + react-query hook + types end-to-end, matching the existing `useTests`/`teacherTestService` pattern.
- `add-shadcn-component` — install/scaffold a shadcn-ui primitive in `src/components/ui/` with the project's semantic color tokens applied.
- `add-i18n-string` — add a translation key to all 4 locales (`uz`, `oz`, `ru`, `en`) consistently.
