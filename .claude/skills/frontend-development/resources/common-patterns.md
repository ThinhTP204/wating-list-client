# Common Patterns

Frequently used patterns for auth, forms, dialogs, mutations, and state management.

---

## Authentication

### Reading Auth State

Auth token and user profile are in **Redux** (not local state, not React Query).

```tsx
"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";  // adjust path as needed

export function useCurrentUser() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  return { user, token, isAuthenticated: !!token };
}
```

**NEVER make API calls for auth state** — always read from the Redux store.

Axios auto-injects the Bearer token from the Redux auth slice on every request.
401 responses trigger automatic logout.

---

## Forms with React Hook Form + Zod + shadcn/ui

### Basic Form Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEmployee } from "@/hooks/useEmployees";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const { mutate, isPending } = useCreateEmployee();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      position: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" variant="brand" disabled={isPending}>
            {isPending ? "Creating..." : "Create Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## Dialog Pattern

### Standard Dialog Structure

```tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UserPlus } from "lucide-react";
import { EmployeeForm } from "./EmployeeForm";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddEmployeeDialog({ open, onClose }: AddEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Required: p-0 overflow-hidden gap-0 */}
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-lg">

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
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-0.5">Fill in the details below</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[65vh] p-6">
          <EmployeeForm onSuccess={onClose} />
        </div>

        {/* No separate footer needed if form has its own buttons */}
        {/* If needed: */}
        {/*
        <div className="border-t px-6 py-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900/50">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="brand">Confirm</Button>
        </div>
        */}

      </DialogContent>
    </Dialog>
  );
}
```

### Confirm Delete Dialog

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useDeleteEmployee } from "@/hooks/useEmployees";

interface DeleteEmployeeDialogProps {
  open: boolean;
  employeeId: string;
  employeeName: string;
  onClose: () => void;
}

export function DeleteEmployeeDialog({
  open,
  employeeId,
  employeeName,
  onClose,
}: DeleteEmployeeDialogProps) {
  const { mutate, isPending } = useDeleteEmployee();

  const handleConfirm = () => {
    mutate(employeeId, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-sm">
        <div className="bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-white font-semibold">Confirm Delete</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>{employeeName}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900/50">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Mutation Pattern with Dialog

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

export function EmployeesHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
      <Button variant="brand" onClick={() => setDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </Button>

      <AddEmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
```

---

## State Management

### Server State → React Query

```typescript
// ✅ Always use React Query for server data
const { data: employees } = useEmployees();
const { mutate: createEmployee } = useCreateEmployee();
```

### UI State → useState

```typescript
// ✅ useState for local UI: dialogs, tabs, toggles
const [open, setOpen] = useState(false);
const [activeView, setActiveView] = useState<"grid" | "list">("grid");
```

### Client Global State → Redux

```typescript
// ✅ Redux only for: auth token, user profile
const user = useSelector((state: RootState) => state.auth.user);
const token = useSelector((state: RootState) => state.auth.token);
```

**Do NOT put feature data in Redux.** Use React Query for all server data.

---

## Status Badge

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "pending" | "approved" | "rejected";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active:   { label: "Active",   className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  pending:  { label: "Pending",  className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge className={cn("border-0", config.className)}>
      {config.label}
    </Badge>
  );
}
```

---

## Summary

- **Auth**: `useSelector` from Redux auth slice — never API calls for user info
- **Forms**: React Hook Form + Zod + shadcn `<Form>` components
- **Dialogs**: gradient header + scrollable body + `border-t` footer
- **Server state**: React Query (`useQuery`/`useMutation`) — not Redux
- **UI state**: `useState` — not Redux
- **Global client state**: Redux — only auth token + user profile
- **Feedback**: `toast` from `sonner` — never other toast libs

**See Also:**
- [data-fetching.md](data-fetching.md) — Mutation patterns
- [styling-guide.md](styling-guide.md) — Dialog + button variants
