# /generate-hook

Generate a typed React Query hook inside the appropriate feature module. (Tạo một React Query hook có đầy đủ type trong module feature phù hợp.)

**Usage**: `/generate-hook [feature/resource] [--mutation]`

## Task

1. **Locate** the existing API service in `features/[feature]/services/[feature]Api.ts` (create if missing)
2. **Determine type**:
   - No flag → `useQuery` (read/fetch)
   - `--mutation` → `useMutation` (create/update/delete)
3. **Generate** `features/[feature]/hooks/use[Feature].ts`

### Query hook template
```typescript
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import { fetch[Resource] } from "@/features/[feature]/services/[feature]Api";
import type { [Resource] } from "@/shared/types/[domain]";

interface Use[Resource]Options {
  id: string;
  enabled?: boolean;
}

export function use[Resource]({ id, enabled = true }: Use[Resource]Options) {
  return useQuery<[Resource], ApiError>({
    queryKey: [QUERY_KEYS.[RESOURCE], id],
    queryFn: () => fetch[Resource](id),
    enabled: enabled && !!id,
  });
}
```

### Mutation hook template
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import {
  create[Resource],
  type Create[Resource]Request,
  type [Resource]Response,
} from "@/features/[feature]/services/[feature]Api";

export function useCreate[Resource]() {
  const queryClient = useQueryClient();

  return useMutation<[Resource]Response, ApiError, Create[Resource]Request>({
    mutationFn: create[Resource],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.[RESOURCE]] });
      toast.success("Tạo thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Thao tác thất bại, vui lòng thử lại.");
    },
  });
}
```

### API service template (`features/[feature]/services/[feature]Api.ts`)
```typescript
import apiService from "@/shared/lib/api/client";
import type { [Resource] } from "@/shared/types/[domain]";

export interface Create[Resource]Request {
  // fields
}

export interface [Resource]Response {
  data: [Resource];
  message: string;
}

export async function fetch[Resource](id: string): Promise<[Resource]> {
  const response = await apiService.request<{ data: [Resource] }>({
    method: "GET",
    url: `/api/v1/[resources]/${id}`,
  });
  return response.data.data;
}

export async function create[Resource](
  payload: Create[Resource]Request
): Promise<[Resource]Response> {
  const response = await apiService.request<[Resource]Response>({
    method: "POST",
    url: "/api/v1/[resources]",
    data: payload,
  });
  return response.data;
}
```

## Conventions

- Hook file: `features/[feature]/hooks/use[Resource].ts`
- Service file: `features/[feature]/services/[feature]Api.ts`
- `QUERY_KEYS` from `@/lib/constants` — `as const` object, never inline string
- `ApiError` from `@/shared/lib/api/client`
- Mutations: `onSuccess` invalidate + `toast.success` AND `onError` + `toast.error`
- Toast messages in Vietnamese
- `import type` for all type-only imports
