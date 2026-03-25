# Data Fetching Patterns

React Query + Axios singleton. All server state via `useQuery` / `useMutation`.

---

## Data Flow

```
Component
  → React Query hook (hooks/)
    → API service fn (lib/api/services/)
      → Axios singleton (lib/api/core.ts)
        → NEXT_PUBLIC_API_URL backend
```

---

## Axios Singleton (`lib/api/core.ts`)

**NEVER create new axios instances.** Always import from `@/lib/api/core`.

```typescript
import { api } from "@/lib/api/core";

// Available methods:
api.get("/path")
api.post("/path", payload)
api.put("/path", payload)
api.patch("/path", payload)
api.delete("/path")
api.upload("/path", formData)
```

The singleton:
- Auto-injects `Bearer` token from Redux auth slice
- Handles 401 → auto logout
- 10-minute timeout

---

## Query Keys

**Always import from `@/lib/constants/queryKeys`** — never inline strings.

```typescript
// ✅ CORRECT
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

useQuery({ queryKey: QUERY_KEYS.employees.all, ... })
useQuery({ queryKey: QUERY_KEYS.employees.detail(id), ... })

// ❌ WRONG
useQuery({ queryKey: ["employees"], ... })
useQuery({ queryKey: ["employee", id], ... })
```

---

## Basic Query Pattern

```typescript
// hooks/useEmployees.ts
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getEmployees } from "@/lib/api/services/employees";

export function useEmployees() {
  return useQuery({
    queryKey: QUERY_KEYS.employees.all,
    queryFn: getEmployees,
  });
}

// Component usage
"use client";
import { useEmployees } from "@/hooks/useEmployees";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeList() {
  const { data, isLoading, error } = useEmployees();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) return <p className="text-destructive">Failed to load employees</p>;

  return (
    <ul>
      {data?.map((employee) => (
        <li key={employee.id}>{employee.name}</li>
      ))}
    </ul>
  );
}
```

---

## Single Item Query

```typescript
export function useEmployee(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.employees.detail(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,  // Don't fetch if id is empty
  });
}
```

---

## Mutation Pattern

```typescript
// hooks/useEmployees.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { createEmployee, updateEmployee, deleteEmployee } from "@/lib/api/services/employees";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      toast.success("Employee created successfully");
    },
    onError: () => toast.error("Failed to create employee"),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      updateEmployee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.detail(id) });
      toast.success("Employee updated");
    },
    onError: () => toast.error("Failed to update employee"),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      toast.success("Employee deleted");
    },
    onError: () => toast.error("Failed to delete employee"),
  });
}
```

### Using Mutations in Components

```tsx
"use client";
import { useCreateEmployee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";

export default function CreateButton() {
  const { mutate, isPending } = useCreateEmployee();

  return (
    <Button
      variant="brand"
      disabled={isPending}
      onClick={() => mutate({ name: "John", email: "john@co.com", department: "HR", position: "Manager" })}
    >
      {isPending ? "Creating..." : "Create Employee"}
    </Button>
  );
}
```

---

## Parallel Queries

```typescript
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useDashboardData() {
  const employees = useQuery({
    queryKey: QUERY_KEYS.employees.all,
    queryFn: getEmployees,
  });

  const tasks = useQuery({
    queryKey: QUERY_KEYS.tasks.all,
    queryFn: getTasks,
  });

  const requests = useQuery({
    queryKey: QUERY_KEYS.requests.pending,
    queryFn: getPendingRequests,
  });

  return {
    employees: employees.data,
    tasks: tasks.data,
    requests: requests.data,
    isLoading: employees.isLoading || tasks.isLoading || requests.isLoading,
  };
}
```

---

## API Service Layer

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

// File upload
export async function uploadAvatar(id: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.upload(`/employees/${id}/avatar`, form);
  return data;
}
```

---

## Query Keys Structure

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
    events: (year: number, month: number) => ["calendar", "events", year, month] as const,
  },
  timekeeping: {
    all: ["timekeeping"] as const,
    byEmployee: (id: string) => ["timekeeping", "employee", id] as const,
    byPeriod: (start: string, end: string) => ["timekeeping", "period", start, end] as const,
  },
  requests: {
    all: ["requests"] as const,
    pending: ["requests", "pending"] as const,
    mine: ["requests", "mine"] as const,
    detail: (id: string) => ["requests", id] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    detail: (id: string) => ["tasks", id] as const,
  },
} as const;
```

---

## Invalidation Patterns

```typescript
// Invalidate a whole resource
queryClient.invalidateQueries({ queryKey: ["employees"] });

// Invalidate a specific item
queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.detail(id) });

// Invalidate multiple related queries at once
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timekeeping.all });
}
```

---

## Optimistic Update

```typescript
export function useToggleEmployeeActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleEmployeeActive(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.employees.all });
      const previous = queryClient.getQueryData<Employee[]>(QUERY_KEYS.employees.all);

      queryClient.setQueryData<Employee[]>(QUERY_KEYS.employees.all, (old) =>
        old?.map((emp) =>
          emp.id === id ? { ...emp, active: !emp.active } : emp
        ) ?? []
      );

      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(QUERY_KEYS.employees.all, context?.previous);
      toast.error("Failed to update employee");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
    },
  });
}
```

---

## Summary

1. **Data flow**: Component → hook → service fn → Axios singleton
2. **Query keys**: Always from `lib/constants/queryKeys.ts` — never inline
3. **Axios**: Only `api` from `lib/api/core.ts` — never new instances
4. **Mutations**: Invalidate related queries + `toast.success/error` from sonner
5. **Loading**: `<Skeleton>` with same layout dimensions
6. **Enabled**: Use `enabled: !!id` to prevent queries with empty params

**See Also:**
- [file-organization.md](file-organization.md) — Where files live
- [loading-and-error-states.md](loading-and-error-states.md) — Skeleton patterns
- [complete-examples.md](complete-examples.md) — Full working examples
