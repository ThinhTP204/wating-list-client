# File Organization

Proper file and directory structure for this Next.js project.

---

## Project Structure

```
app/
├── (landing)/               # Public landing page (unauthenticated)
├── (features)/
│   └── features/
│       ├── layout.tsx       # Tab nav — dashboard, calendar, employees,
│       │                    # time-keeping, request, salary, task
│       └── components/
│           ├── calendar/
│           ├── dashboard/
│           ├── employees/
│           ├── time-keeping/
│           ├── request/
│           ├── salary/
│           └── task/
└── user/                    # User account page

components/
├── ui/                      # shadcn/ui — DO NOT edit these files directly
└── layout/                  # Shared layout components (navbar, sidebar, etc.)

hooks/                       # React Query hooks — named use[Name].ts

lib/
├── api/
│   ├── core.ts              # Axios singleton (Bearer token, 401 logout)
│   └── services/            # API service functions, one file per feature
└── constants/               # queryKey arrays for React Query

types/                       # TypeScript type definitions for API responses
```

---

## Feature Components

All feature-specific UI lives under `app/(features)/features/components/[feature]/`.

### Directory Structure for a Feature

```
app/(features)/features/components/
  employees/
    EmployeeList.tsx          # Main list/table component
    EmployeeCard.tsx          # Card display
    EmployeeForm.tsx          # Create/edit form
    EmployeeDetailDialog.tsx  # Detail modal
    index.ts                  # Re-exports (optional)
```

**Rules:**
- Flat structure if ≤5 components
- Group into subdirs (`dialogs/`, `forms/`, `tables/`) if >5 components
- Feature-specific logic stays in this folder

---

## API Services (`lib/api/services/`)

One file per feature domain. Functions call the Axios singleton from `lib/api/core.ts`.

```
lib/api/services/
  employees.ts
  calendar.ts
  timekeeping.ts
  requests.ts
  salary.ts
  tasks.ts
  dashboard.ts
```

### Service File Pattern

```typescript
// lib/api/services/employees.ts
import { api } from "@/lib/api/core";
import type { Employee, CreateEmployeePayload } from "@/types/employee";

export async function getEmployees(): Promise<Employee[]> {
  const { data } = await api.get("/employees");
  return data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const { data } = await api.get(`/employees/${id}`);
  return data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await api.post("/employees", payload);
  return data;
}

export async function updateEmployee(id: string, payload: Partial<Employee>): Promise<Employee> {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await api.delete(`/employees/${id}`);
}
```

**Key Rules:**
- Use named exports (not default)
- Type all parameters and return values
- Destructure `{ data }` from axios response
- Keep functions focused — one operation per function

---

## React Query Hooks (`hooks/`)

One hook file per feature. Named `use[Resource].ts`.

```
hooks/
  useEmployees.ts
  useCalendar.ts
  useTimekeeping.ts
  useRequests.ts
  useSalary.ts
  useTasks.ts
```

### Hook File Pattern

```typescript
// hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/lib/api/services/employees";
import type { Employee, CreateEmployeePayload } from "@/types/employee";

export function useEmployees() {
  return useQuery({
    queryKey: QUERY_KEYS.employees.all,
    queryFn: getEmployees,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.employees.detail(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      toast.success("Employee created successfully");
    },
    onError: () => toast.error("Failed to create employee"),
  });
}
```

---

## Query Keys (`lib/constants/`)

Centralized query key definitions. **Never inline query key strings.**

```typescript
// lib/constants/queryKeys.ts
export const QUERY_KEYS = {
  employees: {
    all: ["employees"] as const,
    detail: (id: string) => ["employees", id] as const,
    byDepartment: (dept: string) => ["employees", "department", dept] as const,
  },
  calendar: {
    all: ["calendar"] as const,
    byMonth: (year: number, month: number) => ["calendar", year, month] as const,
  },
  timekeeping: {
    all: ["timekeeping"] as const,
    byEmployee: (employeeId: string) => ["timekeeping", employeeId] as const,
  },
} as const;
```

---

## TypeScript Types (`types/`)

One file per domain. All API response shapes defined here.

```
types/
  employee.ts
  calendar.ts
  timekeeping.ts
  request.ts
  salary.ts
  task.ts
  common.ts        # Shared types (pagination, status enums, etc.)
  auth.ts          # Auth/user types
```

```typescript
// types/employee.ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  createdAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  department: string;
  position: string;
}
```

---

## Shared Components (`components/`)

### `components/ui/`
shadcn/ui primitives. **Never edit these directly.**
Add new shadcn components via CLI: `npx shadcn@latest add [component]`

### `components/layout/`
Reusable layout components used across multiple features.

```
components/layout/
  PageHeader.tsx       # Page title + action button slot
  TabNav.tsx           # Tab navigation wrapper
  EmptyState.tsx       # Empty data placeholder
  ErrorState.tsx       # Error display
```

**Rule**: Add to `components/layout/` only if used in 3+ features. Otherwise keep in the feature folder.

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase `.tsx` | `EmployeeCard.tsx` |
| Hook files | camelCase `use` prefix `.ts` | `useEmployees.ts` |
| Service files | camelCase `.ts` | `employees.ts` |
| Type files | camelCase `.ts` | `employee.ts` |
| Constant files | camelCase `.ts` | `queryKeys.ts` |

---

## Summary

1. **Feature UI** → `app/(features)/features/components/[feature]/`
2. **Shared UI** → `components/layout/` (or `components/ui/` for shadcn)
3. **API calls** → `lib/api/services/[feature].ts` via Axios singleton
4. **Hooks** → `hooks/use[Name].ts` wrapping React Query
5. **Query keys** → `lib/constants/queryKeys.ts` — never inline
6. **Types** → `types/[domain].ts` for all API shapes
7. **Single alias** → `@/` only

**See Also:**
- [data-fetching.md](data-fetching.md) — Hook and service patterns
- [component-patterns.md](component-patterns.md) — Component structure
