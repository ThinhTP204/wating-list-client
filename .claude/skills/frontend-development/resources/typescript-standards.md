# TypeScript Standards

TypeScript strict mode conventions for this project.

---

## Configuration

TypeScript **strict mode** is enabled (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This enforces: no implicit `any`, strict null checks, and full type safety.

---

## No `any` Type

```typescript
// ❌ NEVER
function handleData(data: any) { return data.something; }

// ✅ Specific type
function handleData(data: Employee) { return data.name; }

// ✅ unknown with type guard for truly unknown input
function handleUnknown(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    return (data as Employee).name;
  }
}
```

---

## Type Imports

```typescript
// ✅ CORRECT — import type keyword
import type { Employee } from "@/types/employee";
import type { ReactNode } from "react";

// ❌ WRONG — unclear if type or value
import { Employee } from "@/types/employee";
```

---

## Prop Interfaces

```typescript
// ✅ PascalCase, explicit, optional marked with ?
interface EmployeeCardProps {
  employee: Employee;
  onSelect?: (id: string) => void;
  variant?: "compact" | "full";
  className?: string;
}

function EmployeeCard({
  employee,
  onSelect,
  variant = "full",
  className,
}: EmployeeCardProps) {
  // ...
}
```

---

## API Response Types (`types/`)

All API response shapes must be typed in `types/`. Never use inline types for API data.

```typescript
// types/employee.ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  department: string;
  position: string;
}

export type UpdateEmployeePayload = Partial<Omit<Employee, "id" | "createdAt" | "updatedAt">>;
```

---

## Utility Types

```typescript
// Partial — all optional
type EmployeeUpdate = Partial<Employee>;

// Pick — specific fields
type EmployeePreview = Pick<Employee, "id" | "name" | "department">;

// Omit — exclude fields
type EmployeeWithoutDates = Omit<Employee, "createdAt" | "updatedAt">;

// Record — object map
const departmentColors: Record<string, string> = {
  engineering: "#8f58e4",
  hr: "#5e34b7",
};
```

---

## Type Guards

```typescript
function isEmployee(data: unknown): data is Employee {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data
  );
}

// Discriminated union for status
type RequestStatus =
  | { status: "pending" }
  | { status: "approved"; approvedAt: string; approvedBy: string }
  | { status: "rejected"; reason: string };

function renderStatus(req: RequestStatus) {
  if (req.status === "approved") {
    return <p>Approved by {req.approvedBy}</p>;  // TypeScript knows approvedBy exists
  }
  if (req.status === "rejected") {
    return <p>Rejected: {req.reason}</p>;  // TypeScript knows reason exists
  }
  return <p>Pending</p>;
}
```

---

## Null / Undefined Handling

```typescript
// Optional chaining
const name = employee?.profile?.name;

// Nullish coalescing (prefer over || for falsy values)
const displayName = employee?.name ?? "Unknown";

// Non-null assertion — use sparingly, only when certain
const element = document.getElementById("root")!;
```

---

## Generic Types

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
}

// Usage
async function getEmployees(): Promise<ApiResponse<Employee[]>> {
  const { data } = await api.get("/employees");
  return data;
}
```

---

## Explicit Return Types on Service Functions

```typescript
// ✅ CORRECT — explicit return type
export async function getEmployee(id: string): Promise<Employee> {
  const { data } = await api.get(`/employees/${id}`);
  return data;
}

// ✅ OK for components — React.FC infers return type
function EmployeeCard({ employee }: EmployeeCardProps) {
  return <div>{employee.name}</div>;
}
```

---

## Summary

- ✅ Strict mode enabled — no implicit `any`
- ✅ `import type { Foo }` for type-only imports
- ✅ All API shapes in `types/` — PascalCase interfaces
- ✅ Prop interfaces PascalCase + optional `?` + default values in destructuring
- ✅ Utility types: `Partial`, `Pick`, `Omit`, `Record`
- ✅ Type guards for narrowing `unknown`
- ✅ Discriminated unions for status/state
- ❌ No `any` — use `unknown` + type guard if truly unknown

**See Also:**
- [component-patterns.md](component-patterns.md) — Prop interface patterns
- [data-fetching.md](data-fetching.md) — API return types
