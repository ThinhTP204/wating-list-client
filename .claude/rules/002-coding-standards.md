# 002 — Coding Standards

Hook, Service, and Type conventions for this project.

---

## Service — `features/[name]/services/[name]Api.ts`

```typescript
import apiService from "@/shared/lib/api/client";
import type { ApiError } from "@/shared/lib/api/client";
import type { SomeType } from "@/shared/types/[domain]";

// ── Request / Response types ───────────────────────────────────────────────

export interface FetchSomethingParams {
  apiKey: string;
  page?: number;
  limit?: number;
}

export interface CreateSomethingPayload {
  name: string;
  // ...
}

// ── Service functions ──────────────────────────────────────────────────────

export async function fetchSomething({
  apiKey,
  page = 1,
  limit = 10,
}: FetchSomethingParams): Promise<SomeType[]> {
  const response = await apiService.request<{ data: SomeType[] }>({
    method: "GET",
    url: "/api/v1/something",
    params: { page, limit },
    headers: { "x-api-key": apiKey },
  });
  return response.data.data;
}

export async function createSomething(
  payload: CreateSomethingPayload,
  apiKey: string
): Promise<SomeType> {
  const response = await apiService.request<{ data: SomeType }>({
    method: "POST",
    url: "/api/v1/something",
    data: payload,
    headers: { "x-api-key": apiKey },
  });
  return response.data.data;
}
```

**Rules:**
- Named exports only (no default export)
- Explicit parameter and return types on all exports
- One file per feature domain
- File name: `[featureName]Api.ts` (e.g., `employeeApi.ts`, `waitlistApi.ts`)

---

## Hook — `features/[name]/hooks/use[Name].ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import {
  fetchSomething,
  createSomething,
  type FetchSomethingParams,
  type CreateSomethingPayload,
} from "@/features/[name]/services/[name]Api";
import type { SomeType } from "@/shared/types/[domain]";

// ── Query hook ─────────────────────────────────────────────────────────────

interface UseSomethingOptions extends FetchSomethingParams {
  enabled?: boolean;
}

export function useSomething({ apiKey, page, limit, enabled = true }: UseSomethingOptions) {
  return useQuery<SomeType[], ApiError>({
    queryKey: [QUERY_KEYS.SOMETHING, page, limit, apiKey],
    queryFn: () => fetchSomething({ apiKey, page, limit }),
    enabled: enabled && !!apiKey,
  });
}

// ── Mutation hook ──────────────────────────────────────────────────────────

export function useCreateSomething(apiKey: string) {
  const queryClient = useQueryClient();

  return useMutation<SomeType, ApiError, CreateSomethingPayload>({
    mutationFn: (payload) => createSomething(payload, apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SOMETHING] });
      toast.success("Tạo thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Thao tác thất bại, vui lòng thử lại.");
    },
  });
}
```

**Rules:**
- Named exports only
- Every hook has an `enabled` guard on `useQuery` (`enabled && !!criticalParam`)
- Mutations always: `onSuccess` invalidate + `toast.success` AND `onError` + `toast.error`
- Toast messages in Vietnamese
- `ApiError` from `@/shared/lib/api/client` as the error generic

---

## Types — Placement

| Scenario | Location |
|----------|----------|
| Used by 2+ features | `shared/types/[domain].ts` |
| Used only by one feature | `features/[name]/types/index.ts` |
| Redux state shape | Inline in `lib/redux/slices/[name]Slice.ts` |
| API request/response | Inline in `features/[name]/services/[name]Api.ts` |

```typescript
// shared/types/employee.ts — shared domain model
export interface Employee {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  status: string;
  is_active: boolean;
  created_at: string;
}

// features/employees/services/employeeApi.ts — API-specific shapes (stay here)
export interface FetchEmployeesParams {
  page?: number;
  limit?: number;
  apiKey: string;
}
```

---

## Query Keys — `lib/constants/index.ts`

```typescript
export const QUERY_KEYS = {
  USERS: "users",
  REFERRAL_STATS: "referral-stats",
  // Add new keys as SCREAMING_SNAKE_CASE strings
  SHIFTS: "shifts",
  SALARY: "salary",
} as const;
```

- Always `as const`
- SCREAMING_SNAKE_CASE
- Never inline query key strings in hooks — always use `QUERY_KEYS`

---

## Import Order (enforced)

```typescript
// 1. External packages
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// 2. @/lib (store, constants, utils)
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// 3. @/shared
import apiService from "@/shared/lib/api/client";
import type { UserItem } from "@/shared/types/user";

// 4. @/features
import { fetchEmployees } from "@/features/employees/services/employeeApi";

// 5. @/hooks (only for cross-feature hooks not yet in features/)
// 6. @/components
import { Button } from "@/components/ui/button";

// 7. Relative imports (same feature)
import type { LocalType } from "./types";
```

---

## Anti-patterns to Avoid

| Anti-pattern | Correct |
|---|---|
| `import from "@/hooks/useUser"` | `import from "@/features/employees/hooks/useEmployees"` |
| `import from "@/lib/api/services/fetchUser"` | `import from "@/features/employees/services/employeeApi"` |
| `import from "@/lib/api/core"` | `import from "@/shared/lib/api/client"` |
| `import from "@/types/models"` | `import from "@/shared/types/user"` (or appropriate domain) |
| Inline query key `queryKey: ["users"]` | `queryKey: [QUERY_KEYS.USERS]` |
| `toast.error("Failed")` with no Vietnamese | `toast.error("Thao tác thất bại, vui lòng thử lại.")` |
