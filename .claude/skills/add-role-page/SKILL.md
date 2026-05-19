---
name: add-role-page
description: Add a new page to a role module (admin, teacher, student, employee) and wire it into App.tsx routing with the correct ProtectedRoute guard and permission string. Use when the user asks to add a new page, screen, or view.
---

# Add a role-scoped page

Pages live under `src/modules/<role>/pages/` and are registered in `src/App.tsx`. Every protected route uses `<ProtectedRoute>` with the appropriate `permission` and/or `resourcePath` props.

## Decision flow

1. **Which role(s) see this page?** Admin / Teacher / Student / Employee dashboard / Shared (multi-role)?
   - Single role → `src/modules/<role>/pages/<Name>Page.tsx`.
   - Multi-role (e.g. messaging, forum, notifications) → `src/modules/shared/pages/<Name>Page.tsx`.
2. **Does this page exist on the backend?** Grep the backend (`../univer-back/routes/api_v1.php`) for a matching `<role>/<endpoint>`. If not, you'll need an endpoint there first (run the backend's `add-role-endpoint` skill). Don't write a page that calls a nonexistent API.
3. **What is the permission string?** Backend permissions live in `e_admin_resource.path` (Yii2-owned). Look at the route's `permission:` middleware in `routes/api_v1.php` — that's the string you pass to `<ProtectedRoute permission="...">`. Examples: `student.view`, `teacher.*` (wildcard), `hemis.sync`. The frontend reads JWT claims (UX only); real enforcement is server-side.

## File checklist

1. **`src/modules/<role>/pages/<Name>Page.tsx`**
   - Default export the page component.
   - Use the data via the **hook layer**: `import { use<Resource> } from '@/hooks/api/<role>'` (or from `@/hooks/use<Resource>` directly). Don't call `apiClient` or service classes from the page.
   - Loading state: `<Skeleton />` or a similar shadcn primitive. Error state: render an inline error or a `toast.error(...)` + redirect-back.
   - Use shadcn-ui components from `src/components/ui/` (Card, Button, Dialog, etc.). Don't reimplement.
   - Use semantic color tokens (`bg-primary-500`, `text-medical-600`) — see `tailwind.config.ts`.
   - All user-visible strings via `useTranslation()` from `react-i18next` — never hard-code Uzbek/Russian text in JSX. New keys go in all 4 locales (run `add-i18n-string` skill if needed).
2. **`src/modules/<role>/pages/index.ts`** *(if it exists for this role)*
   - Re-export the new page.
3. **`src/App.tsx`**
   - Add a `import <Name>Page from '@/modules/<role>/pages/<Name>Page'` at the top.
   - Add a `<Route path="..." element={<ProtectedRoute permission="<resource>.<action>"><Name>Page /></ProtectedRoute>} />` in the appropriate `<Routes>` block.
   - For role-specific routes, gate with both `permission` (server-side truth) and optionally `allowedRoles={['admin', ...]}` (UX hint).
4. **Menu integration** *(if the page should appear in the side menu)*
   - Backend menu (`menuService`) returns items keyed by permission/path. New menu entries belong on the backend (`MenuRepository` or the Yii2 admin UI). The frontend renders whatever it gets.
   - If you need a UI-only menu (no backend-driven), add a hardcoded item — but check first whether the backend menu should be the source of truth.
5. **Tests** *(if a test pattern exists for the role; check `src/test/` and any sibling `*.test.tsx` files first)*
   - Vitest + `@testing-library/react`. Mock services via `vi.mock('@/services/...')`.

## Wiring example

```tsx
// src/modules/teacher/pages/AssignmentsPage.tsx
import { useTranslation } from 'react-i18next'
import { useAssignments } from '@/hooks/api/teacher'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AssignmentsPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useAssignments()

  if (isLoading) return <Skeleton className="h-64" />
  if (error) return <div className="text-error-600">{t('errors.loadFailed')}</div>

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-primary-700">{t('teacher.assignments.title')}</h1>
      {/* ... */}
    </Card>
  )
}
```

```tsx
// src/App.tsx (snippet)
import AssignmentsPage from '@/modules/teacher/pages/AssignmentsPage'
// ...
<Route
  path="/teacher/assignments"
  element={
    <ProtectedRoute permission="teacher.assignments.view" allowedRoles={['teacher']}>
      <AssignmentsPage />
    </ProtectedRoute>
  }
/>
```

## Verification

```bash
yarn type-check                # strict TS — must pass
yarn lint                      # no errors; warnings on any are OK if intentional
yarn dev                       # navigate to the new route, watch the network panel
yarn test:run path/to/<Name>Page.test.tsx
```

Manual checks while running `yarn dev`:

- Page renders for an authorized user (log in via `/login` with a role that has the permission).
- Page redirects to `/login` (or `/unauthorized` per `redirectTo`) for an unauthorized user.
- Network requests use the canonical `/api/v1/<role>/...` path, not a Yii2-compat alias.
- Locale switcher swaps the page's strings.

## What NOT to do

- **Don't** add files under `src/pages/` — it's excluded by `tsconfig.json` and `eslint.config.js` and is effectively dead code.
- **Don't** call `apiClient` (`@/lib/api/client`) directly from a page. Go through a service + hook.
- **Don't** hardcode user-visible strings. Always `t('namespaced.key')`.
- **Don't** treat `<RequirePermission>` or JWT permissions as security. The backend enforces; frontend gates only for UX.
- **Don't** override `QueryClient` defaults (`staleTime: 5min`, `retry: 1`, `refetchOnWindowFocus: false`) globally — per-query overrides are fine when justified.
- **Don't** introduce a new toast library; use `sonner` (`import { toast } from 'sonner'`), already mounted in `main.tsx`.
