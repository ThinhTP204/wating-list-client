# Loading & Error States

Patterns for loading and error states using shadcn `<Skeleton>` and `sonner` toast.

---

## Loading States

### The Rule: Preserve Layout with Skeletons

Render `<Skeleton>` components with the **same dimensions** as the actual content to avoid layout shift.

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// ✅ CORRECT — same layout as actual content
function EmployeeCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

// ✅ Rendered while isLoading is true
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

### What NOT to Do

```tsx
// ❌ WRONG — causes layout shift
if (isLoading) return <div className="h-8 w-8 animate-spin rounded-full border-4" />;

// ❌ WRONG — blank content area while loading
if (isLoading) return null;

// ❌ WRONG — spinner doesn't preserve content dimensions
{isLoading ? <LoadingSpinner /> : <Content />}
```

---

### Skeleton Patterns by Component Type

#### Stats Card

```tsx
function StatsCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
```

#### Table / List

```tsx
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 px-4 py-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-t">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
```

#### Form

```tsx
function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-28 rounded-md" />
    </div>
  );
}
```

---

## Error States

### User Feedback with Sonner

Use `toast` from `sonner` for all user-facing feedback.

```tsx
import { toast } from "sonner";

// Success
toast.success("Employee created successfully");

// Error
toast.error("Failed to create employee");

// Info
toast.info("Changes saved");

// Warning
toast.warning("Some fields are incomplete");

// Custom
toast("Custom message", {
  description: "Additional context here",
  action: {
    label: "Undo",
    onClick: () => handleUndo(),
  },
});
```

**NEVER use other toast libraries** — only `sonner`.

### Error in Query Callbacks

```tsx
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      toast.success("Employee created successfully");
    },
    onError: (error) => {
      // Log for debugging
      console.error("Create employee error:", error);
      // User-friendly message
      toast.error("Failed to create employee");
    },
  });
}
```

### Inline Error Display

For query errors that prevent the page from rendering:

```tsx
function EmployeeList() {
  const { data, isLoading, error } = useEmployees();

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Failed to load employees
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Please try again or contact support.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!data?.length) return <EmptyState />;

  return <>{data.map((emp) => <EmployeeCard key={emp.id} employee={emp} />)}</>;
}
```

---

## Inline Loading Buttons

```tsx
import { Loader2 } from "lucide-react";

function SaveButton({ onSave }: { onSave: () => void }) {
  const { mutate, isPending } = useUpdateEmployee();

  return (
    <Button
      variant="brand"
      disabled={isPending}
      onClick={() => mutate(...)}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}
```

---

## Summary

**Loading:**
- ✅ `<Skeleton>` with exact same layout as real content
- ✅ Multiple skeletons for list/grid items
- ❌ Never spinner-only returns (layout shift)
- ❌ Never return null while loading

**Errors:**
- ✅ `toast.success/error/info/warning` from `sonner`
- ✅ Inline error state for page-level query failures
- ✅ `onSuccess` / `onError` in every mutation
- ❌ Never use react-toastify or other toast libraries

**See Also:**
- [data-fetching.md](data-fetching.md) — Mutation patterns
- [component-patterns.md](component-patterns.md) — Skeleton integration
