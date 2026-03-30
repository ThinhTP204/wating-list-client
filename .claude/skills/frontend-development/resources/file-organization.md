# File Organization

FSD (Feature-Sliced Design) structure for this Next.js project.

---

## Project Structure

```
app/                          ← Routing ONLY (pages, layouts)
├── (landing)/page.tsx        → URL: /        (public)
├── login/page.tsx            → URL: /login   (auth)
├── (admin)/admin/            → URL: /admin   (admin role)
│   ├── layout.tsx            # Tab nav + logout
│   ├── page.tsx
│   └── components/           # Admin UI components
│       ├── dashboard/
│       ├── employees/
│       ├── request/
│       ├── salary/
│       └── time-keeping/
├── (employee)/employee/      → URL: /employee (user role)
│   ├── layout.tsx            # Tab nav + logout
│   ├── page.tsx
│   └── components/           # Employee UI components
│       ├── earnings/
│       └── shift-swap/
├── (features)/features/      → shared feature components (no page.tsx)
│   └── components/
│       └── calendar/         # Used by both admin and employee
└── user/page.tsx             → URL: /user    (authenticated)

features/                     ← Domain modules (self-contained)
├── waitlist/
│   ├── hooks/use[Name].ts
│   └── services/[name]Api.ts
└── employees/
    ├── hooks/useEmployees.ts
    └── services/employeeApi.ts

shared/                       ← Cross-cutting code
├── lib/
│   └── api/
│       └── client.ts         # Axios singleton — THE one import for all API calls
└── types/
    ├── user.ts
    ├── product.ts
    └── order.ts

components/
├── ui/                       # shadcn/ui — DO NOT edit directly
└── layout/                   # Shared layout (Header, Navbar, etc.)

lib/
├── redux/
│   ├── store.ts
│   └── slices/authSlice.ts
├── constants/
│   └── index.ts              # QUERY_KEYS
└── utils.ts                  # cn() and other utilities
```

---

## Where to Put a New File

```
Is it a page or route layout?
  YES → app/

Is it used by only one feature?
  YES → features/[name]/[hooks|services|types|components]/

Is it used by multiple features OR is it the API client?
  YES → shared/[lib|types]/

Is it a UI primitive (shadcn or shared layout)?
  YES → components/[ui|layout]/

Is it Redux store, query constants, or utility?
  YES → lib/[redux|constants]/
```

---

## Feature Module Structure

```
features/
└── [feature-name]/
    ├── hooks/
    │   └── use[FeatureName].ts    # useQuery + useMutation
    ├── services/
    │   └── [featureName]Api.ts    # fetch, create, update, delete functions
    └── types/                     # (optional) feature-only types
        └── index.ts
```

### Service File Pattern

```typescript
// features/employees/services/employeeApi.ts
import apiService from "@/shared/lib/api/client";
import type { UserItem, UserListResponse } from "@/shared/types/user";

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  apiKey: string;
}

export async function fetchUsers({
  page = 1,
  limit = 10,
  apiKey,
}: FetchUsersParams): Promise<UserListResponse> {
  const response = await apiService.request<UserListResponse>({
    method: "GET",
    url: "/api/v1/users",
    params: { page, limit },
    headers: { "x-api-key": apiKey },
  });
  return response.data;
}
```

### Hook File Pattern

```typescript
// features/employees/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import { fetchUsers, deleteUser } from "@/features/employees/services/employeeApi";
import type { UserListResponse } from "@/shared/types/user";

export function useUsers({ page = 1, limit = 10, apiKey, enabled = true }) {
  return useQuery<UserListResponse, ApiError>({
    queryKey: [QUERY_KEYS.USERS, page, limit, apiKey],
    queryFn: () => fetchUsers({ page, limit, apiKey }),
    enabled: enabled && !!apiKey,
  });
}
```

---

## Query Keys (`lib/constants/index.ts`)

```typescript
export const QUERY_KEYS = {
  USERS: "users",
  REFERRAL_STATS: "referral-stats",
  SHIFTS: "shifts",
  SALARY: "salary",
} as const;
```

- Always `as const`
- SCREAMING_SNAKE_CASE
- Never inline query key strings in hooks

---

## Shared Types (`shared/types/`)

One file per domain. Use for types shared by 2+ features.

```
shared/types/
├── user.ts       # UserItem, UserListResponse, etc.
├── product.ts    # Product
└── order.ts      # Order, OrderItem
```

Feature-specific request/response shapes stay in `features/[name]/services/[name]Api.ts`.

---

## DEPRECATED Paths

These paths are from the old structure. **Do not use for new code.**

| Old (deprecated) | New (correct) |
|-----------------|---------------|
| `hooks/use*.ts` | `features/[name]/hooks/use*.ts` |
| `lib/api/services/fetch*.ts` | `features/[name]/services/*Api.ts` |
| `lib/api/core.ts` | `shared/lib/api/client.ts` |
| `types/models.ts` | `shared/types/[domain].ts` |
| `app/(features)/features/components/` | `app/(admin)/admin/components/` or `app/(employee)/employee/components/` |

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Feature hook | `use[Resource].ts` | `useEmployees.ts` |
| Feature service | `[resource]Api.ts` | `employeeApi.ts` |
| Shared type | `[domain].ts` | `user.ts` |
| Component | `[Name].tsx` PascalCase | `EmployeeCard.tsx` |
| Query key | `SCREAMING_SNAKE_CASE` | `QUERY_KEYS.USERS` |
