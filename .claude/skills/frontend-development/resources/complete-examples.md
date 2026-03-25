# Complete Examples

Full working examples aligned with this project's stack: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, React Query, Redux Toolkit.

---

## Example 1: Full Feature Page (Employees Tab)

### Service (`lib/api/services/employees.ts`)

```typescript
import { api } from "@/lib/api/core";
import type { Employee, CreateEmployeePayload } from "@/types/employee";

export async function getEmployees(): Promise<Employee[]> {
  const { data } = await api.get("/employees");
  return data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await api.post("/employees", payload);
  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await api.delete(`/employees/${id}`);
}
```

### Query Keys (`lib/constants/queryKeys.ts`)

```typescript
export const QUERY_KEYS = {
  employees: {
    all: ["employees"] as const,
    detail: (id: string) => ["employees", id] as const,
  },
} as const;
```

### Hook (`hooks/useEmployees.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getEmployees, createEmployee, deleteEmployee } from "@/lib/api/services/employees";
import type { CreateEmployeePayload } from "@/types/employee";

export function useEmployees() {
  return useQuery({
    queryKey: QUERY_KEYS.employees.all,
    queryFn: getEmployees,
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

### Component (`app/(features)/features/components/employees/EmployeesTab.tsx`)

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployees";
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import type { Employee } from "@/types/employee";

export default function EmployeesTab() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { data = [], isLoading } = useEmployees();
  const { mutate: deleteEmp } = useDeleteEmployee();

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{data.length} total</p>
        </div>
        <Button variant="brand" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filtered.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <EmployeeRow
                  employee={employee}
                  onDelete={() => deleteEmp(employee.id)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      <AddEmployeeDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function EmployeeRow({
  employee,
  onDelete,
}: {
  employee: Employee;
  onDelete: () => void;
}) {
  const initials = employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{employee.name}</p>
          <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
        </div>
        <Badge variant="secondary">{employee.department}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## Example 2: Dialog with Form

```tsx
// app/(features)/features/components/employees/AddEmployeeDialog.tsx
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEmployee } from "@/hooks/useEmployees";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Required"),
  position: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddEmployeeDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCreateEmployee();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-md">

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <DialogTitle className="text-white font-semibold text-lg">
                Add Employee
              </DialogTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="john@company.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Department</Label>
              <Select onValueChange={(v) => setValue("department", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="position">Position</Label>
              <Input id="position" {...register("position")} placeholder="Software Engineer" />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900/50">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={isPending}>
              {isPending ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
```

---

## Example 3: Stats Dashboard Card Grid

```tsx
"use client";

import { Users, Clock, CheckSquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useDashboard";

const STAT_CONFIGS = [
  { key: "totalEmployees", label: "Total Employees", icon: Users, color: "text-[#8f58e4]" },
  { key: "pendingRequests", label: "Pending Requests", icon: AlertCircle, color: "text-yellow-600" },
  { key: "activeTasks", label: "Active Tasks", icon: CheckSquare, color: "text-blue-600" },
  { key: "hoursToday", label: "Hours Today", icon: Clock, color: "text-green-600" },
] as const;

export default function DashboardTab() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIGS.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="overflow-hidden">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                      {data?.[key] ?? 0}
                    </p>
                  </div>
                  <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## Example 4: Table with Actions

```tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Trash2 } from "lucide-react";
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployees";
import { cn } from "@/lib/utils";

export default function EmployeeTable() {
  const { data = [], isLoading } = useEmployees();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteEmployee(id, { onSettled: () => setDeletingId(null) });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            data.map((employee) => (
              <TableRow key={employee.id} className={cn(deletingId === employee.id && "opacity-50")}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      employee.active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                      "border-0"
                    )}
                  >
                    {employee.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={deletingId === employee.id}
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Key Takeaways

1. **Stack**: Next.js 16 App Router · Tailwind v4 · shadcn/ui · React Query · sonner
2. **Feature UI**: `app/(features)/features/components/[feature]/`
3. **Services**: `lib/api/services/` → Axios singleton → API
4. **Hooks**: `hooks/use[Name].ts` wrapping React Query
5. **Query keys**: from `lib/constants/queryKeys.ts` — never inline
6. **Feedback**: `toast.success/error` from `sonner`
7. **Loading**: `<Skeleton>` preserving layout
8. **Dialog**: gradient header `from-[#402093] via-[#5e34b7] to-[#8f58e4]`
9. **Animation**: `motion/react` for transitions, GSAP for complex sequences
10. **Dark mode**: always pair custom colors with `dark:` variant
