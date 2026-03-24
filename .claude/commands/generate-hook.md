# /generate-hook

Generate a typed React Query hook in `hooks/`.

**Usage**: `/generate-hook [resource] [--mutation]`

## Task

1. **Locate** the existing API service in `lib/api/services/fetch[Resource].ts` (create if missing)
2. **Determine type**:
   - No flag → `useQuery` (read/fetch)
   - `--mutation` → `useMutation` (create/update/delete)
3. **Generate** `hooks/use[Resource].ts`

### Query hook template
```ts
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { ApiError } from '@/lib/api/core'
import { fetch[Resource] } from '@/lib/api/services/fetch[Resource]'
import type { [Resource] } from '@/types/models'

interface Use[Resource]Options {
  id: string
  enabled?: boolean
}

export function use[Resource]({ id, enabled = true }: Use[Resource]Options) {
  return useQuery<[Resource], ApiError>({
    queryKey: [QUERY_KEYS.[RESOURCE], id],
    queryFn: () => fetch[Resource](id),
    enabled: enabled && !!id,
  })
}
```

### Mutation hook template
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/lib/constants'
import { ApiError } from '@/lib/api/core'
import { create[Resource], type Create[Resource]Request, type [Resource]Response } from '@/lib/api/services/fetch[Resource]'

export function useCreate[Resource]() {
  const queryClient = useQueryClient()

  return useMutation<[Resource]Response, ApiError, Create[Resource]Request>({
    mutationKey: [QUERY_KEYS.[RESOURCE]],
    mutationFn: create[Resource],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.[RESOURCE]] })
    },
    onError: (error) => {
      toast.error(error.message || 'Thao tác thất bại, vui lòng thử lại.')
    },
  })
}
```

### API service template (`lib/api/services/fetch[Resource].ts`)
```ts
import apiService from '@/lib/api/core'
import type { [Resource] } from '@/types/models'

export interface Create[Resource]Request {
  // fields
}

export interface [Resource]Response {
  data: [Resource]
  message: string
}

export async function fetch[Resource](id: string): Promise<[Resource]> {
  const response = await apiService.get<[Resource]>(`/api/v1/[resources]/${id}`)
  return response.data
}

export async function create[Resource](payload: Create[Resource]Request): Promise<[Resource]Response> {
  const response = await apiService.post<[Resource]Response, Create[Resource]Request>(
    '/api/v1/[resources]',
    payload
  )
  return response.data
}
```

## Conventions

- File: `hooks/use[Resource].ts` — PascalCase resource, camelCase filename
- Service file: `lib/api/services/fetch[Resource].ts` — prefix `fetch`
- `QUERY_KEYS` from `@/lib/constants` — dạng object `as const`, không inline string
- `ApiError` import từ `@/lib/api/core` cho generic error type
- Mutations: `mutationKey` + `mutationFn` + `onSuccess` invalidate + `onError` toast
- Toast message bằng tiếng Việt (error.message fallback)
- Types: `import type` cho tất cả type-only imports
