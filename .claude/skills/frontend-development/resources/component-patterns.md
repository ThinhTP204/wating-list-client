# Component Patterns

Modern React component architecture for this Next.js 16 / React 19 application.

---

## `"use client"` Directive

**Default to Server Components.** Only add `"use client"` when the component:
- Uses React hooks (`useState`, `useEffect`, `useQuery`, etc.)
- Has event handlers (`onClick`, `onChange`, etc.)
- Uses browser APIs

```tsx
// ✅ Server Component — no directive needed
export default function EmployeeListPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Employees</h1>
      <EmployeeListClient />  {/* delegate interactive parts */}
    </div>
  );
}

// ✅ Client Component — uses hooks
"use client";
export default function EmployeeListClient() {
  const { data, isLoading } = useEmployees();
  // ...
}
```

---

## Component Structure Template

```tsx
"use client";  // Only if needed

// 1. External imports
import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, Search } from "lucide-react";

// 2. @/lib imports
import { cn } from "@/lib/utils";

// 3. @/hooks imports
import { useEmployees, useCreateEmployee } from "@/hooks/useEmployees";

// 4. @/components imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// 5. @/types imports
import type { Employee } from "@/types/employee";

// Props interface — PascalCase, explicit
interface EmployeeCardProps {
  employee: Employee;
  onSelect?: (id: string) => void;
  className?: string;
}

// Component definition
function EmployeeCard({ employee, onSelect, className }: EmployeeCardProps) {
  // Hooks first
  const [expanded, setExpanded] = useState(false);

  // Memoized values
  const initials = useMemo(
    () => employee.name.split(" ").map((n) => n[0]).join(""),
    [employee.name]
  );

  // Event handlers with useCallback (when passed to children)
  const handleSelect = useCallback(() => {
    onSelect?.(employee.id);
  }, [employee.id, onSelect]);

  // Render
  return (
    <Card
      className={cn("cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={handleSelect}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">{employee.department}</Badge>
      </CardContent>
    </Card>
  );
}

// Default export at bottom
export default EmployeeCard;
```

---

## Loading State Pattern

Use `<Skeleton>` with the same layout dimensions as the actual content.

```tsx
// ✅ CORRECT — Skeleton preserves layout
function EmployeeCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
}

function EmployeeList() {
  const { data, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <EmployeeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data?.map((emp) => <EmployeeCard key={emp.id} employee={emp} />)}
    </div>
  );
}
```

---

## Empty State Pattern

```tsx
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyEmployeeState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-[#8f58e4]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        No employees yet
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add your first employee to get started.
      </p>
      <Button variant="brand" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </Button>
    </div>
  );
}
```

---

## List with Search

```tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeCard from "./EmployeeCard";

export default function EmployeeList() {
  const [search, setSearch] = useState("");
  const { data = [], isLoading } = useEmployees();

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <EmployeeCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## When to Split Components

**Split when:**
- Component exceeds 250–300 lines
- Multiple distinct responsibilities
- Section is reusable

**Keep together when:**
- < 200 lines
- Tightly coupled logic
- Not reusable elsewhere

---

## Export Patterns

```tsx
// ✅ PREFERRED — default export for page/feature components
export default function EmployeeList() { ... }

// ✅ Named export for reusable UI pieces
export function EmployeeCard({ employee }: EmployeeCardProps) { ... }

// ✅ Both — when used both internally and externally
export function EmployeeCard({ ... }: ...) { ... }
export default EmployeeCard;
```

---

## Props Pattern

```tsx
// ✅ Explicit interface, optional with defaults, className always accepted
interface CardProps {
  title: string;
  description?: string;
  variant?: "default" | "highlighted";
  onAction?: () => void;
  className?: string;
}

function MyCard({
  title,
  description,
  variant = "default",
  onAction,
  className,
}: CardProps) {
  return (
    <Card className={cn(
      variant === "highlighted" && "border-[#8f58e4]",
      className
    )}>
      ...
    </Card>
  );
}
```

---

## Summary

1. `"use client"` — only for hooks/events; default to Server Components
2. Import order: external → `@/lib` → `@/hooks` → `@/components` → `@/types`
3. shadcn/ui first — never raw HTML for interactive elements
4. Loading states: `<Skeleton>` preserving layout
5. `cn()` for conditional classes + always accept `className` prop
6. Export default at bottom; named exports for shared components
7. Lists: stable `key` from data ID, never array index

**See Also:**
- [data-fetching.md](data-fetching.md) — useQuery patterns
- [styling-guide.md](styling-guide.md) — Tailwind + design system
- [complete-examples.md](complete-examples.md) — Full working examples
