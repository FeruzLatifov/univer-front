---
name: add-api-feature
description: Add an end-to-end API integration — typed service method + react-query hook + TS types — that mirrors a backend endpoint. Use when the user asks to connect a new backend endpoint, fetch new data, or add a mutation.
---

# Add a typed API feature (service + hook + types)

The frontend has two layers between components and the backend:

1. **Service layer** (`src/services/<role>/<Name>Service.ts`) — typed class extending `BaseApiService` with `get/post/put/patch/delete` helpers.
2. **Hook layer** (`src/hooks/use<Resource>.ts`, re-exported from `src/hooks/api/<role>/index.ts`) — react-query wrappers with query keys and toasts.

A component **always** consumes the hook, never the service directly. The service is the typed boundary against the backend; the hook is the typed boundary against React.

## Decision flow

1. **What is the backend endpoint?** Find it in `../univer-back/routes/api_v1.php`. Confirm:
   - Path (`/api/v1/<role>/<resource>/...`)
   - Method (GET/POST/PUT/DELETE)
   - Auth guard (`auth:<role>-api`)
   - Permission (`permission:<resource>.<action>`)
   - Request shape (look at the `FormRequest` class under `../univer-back/app/Http/Requests/`)
   - Response shape (look at the controller method + any `Api Resource` class, plus the `{success, data, message}` envelope)
2. **Does a service already exist for this role+resource?** Check `src/services/<role>/`. Add the method to the existing service rather than creating a parallel one.
3. **Is this a query or a mutation?**
   - Query (GET) → `useQuery`. Need a stable query key.
   - Mutation (POST/PUT/PATCH/DELETE) → `useMutation` + `queryClient.invalidateQueries({ queryKey })` + toast on success/error.

## File checklist

### 1. Types — `src/lib/api/<resource>.ts`

Declare the request/response TS interfaces. Keep types in this folder (NOT in the service file) because they're also consumed by raw fetchers and tests.

```ts
export interface Assignment {
  id: number
  title: string
  due_date: string
  // ... match the unwrapped data: shape from backend, not the envelope
}

export interface CreateAssignmentRequest {
  title: string
  due_date: string
  group_id: number
}
```

Remember: the axios interceptor strips `{success, data, message}` automatically. Your TS types describe `data`, not the envelope. Listing-style responses come as `{ items: T[], meta: PaginationMeta }` or as a bare array — check the controller.

### 2. Service — `src/services/<role>/<Name>Service.ts`

Extend `BaseApiService` with a basePath like `/v1/<role>/<resource>`. Add a typed method per use case:

```ts
import { BaseApiService } from '../base/BaseApiService'
import type { Assignment, CreateAssignmentRequest } from '@/lib/api/assignments'

class TeacherAssignmentService extends BaseApiService {
  constructor() { super('/v1/teacher/assignments') }

  async list(params?: { status?: string }): Promise<Assignment[]> {
    return this.get<Assignment[]>('', { params })
  }

  async create(payload: CreateAssignmentRequest): Promise<Assignment> {
    return this.post<Assignment>('', payload)
  }
}

export const teacherAssignmentService = new TeacherAssignmentService()
```

Then re-export from `src/services/<role>/index.ts` and `src/services/index.ts`.

### 3. Hook — `src/hooks/use<Resource>.ts`

Follow the pattern in `src/hooks/useTests.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { teacherAssignmentService } from '@/services'
import { getErrorMessage } from '@/lib/utils/error'
import type { Assignment, CreateAssignmentRequest } from '@/lib/api/assignments'

export const assignmentKeys = {
  all: ['teacher', 'assignments'] as const,
  list: (filters?: object) => [...assignmentKeys.all, 'list', filters] as const,
  detail: (id: number) => [...assignmentKeys.all, 'detail', id] as const,
}

export function useAssignments(filters?: { status?: string }) {
  return useQuery({
    queryKey: assignmentKeys.list(filters),
    queryFn: () => teacherAssignmentService.list(filters),
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAssignmentRequest) => teacherAssignmentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all })
      toast.success('Topshiriq yaratildi')
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
```

Then re-export from `src/hooks/api/<role>/index.ts`:

```ts
export * from '../../useAssignments'
```

### 4. Wire it up in a component

```tsx
const { data, isLoading } = useAssignments({ status: 'open' })
const createMutation = useCreateAssignment()

createMutation.mutate(payload, {
  onSuccess: () => navigate('/teacher/assignments'),
})
```

## Verification

```bash
yarn type-check         # strict — must pass
yarn lint
yarn test:run path/to/useAssignments.test.ts    # if a test exists
yarn dev                # exercise in the browser, watch network panel
```

Manual checks:

- Network request hits the right URL with `Authorization: Bearer <token>`, `Accept-Language`, `X-Locale` headers.
- 401 → user is logged out (axios interceptor + authStore).
- 403 → toast shows the localized backend message (`Sizda bu amalni bajarish uchun ruxsat yo'q`).
- 422 → form surfaces field errors from `err.response.data.errors`.
- 429 → toast surfaces `retry_after`.

## What NOT to do

- **Don't** call `apiClient.get(...)` from a component. Always go through the service.
- **Don't** put the type definitions inside the service file. They belong in `src/lib/api/<resource>.ts` so raw fetchers and tests can import them without pulling in the service singleton.
- **Don't** invalidate the entire cache (`queryClient.invalidateQueries()` with no args) on a mutation. Scope to the relevant key(s).
- **Don't** retry mutations on failure. The QueryClient default `retry: 1` applies to queries; mutations should fail loudly.
- **Don't** swallow errors with `.catch(() => {})`. Either handle (toast, retry, etc.) or let react-query surface them.
- **Don't** add fallback data ("just return `[]` if it fails") — show the error state. Hidden empty states confuse users.
