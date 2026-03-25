# Performance Optimization

Patterns for optimal rendering in React 19 / Next.js 16.

---

## useMemo for Expensive Computations

```typescript
import { useMemo } from "react";

// ✅ Memoize filtering/sorting
const filteredEmployees = useMemo(() => {
  if (!search) return employees;
  const q = search.toLowerCase();
  return employees
    .filter((e) =>
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}, [employees, search]);

// When to use:
// - Filtering/sorting arrays
// - Complex data transformations
// - Computing derived values from large datasets

// When NOT to use:
// - Simple string concatenation or arithmetic
// - Computations on small arrays (< 20 items)
// - Premature optimization (profile first)
```

---

## useCallback for Stable Function References

```typescript
import { useCallback } from "react";

// ✅ Stable reference for handlers passed to children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []); // Empty deps = stable reference

// ✅ With deps
const handleUpdate = useCallback((id: string, data: UpdatePayload) => {
  updateEmployee({ id, data });
}, [updateEmployee]);

// When to use:
// - Functions passed as props to child components
// - Functions as useEffect dependencies
// - Handlers on memoized (React.memo) children

// When NOT to use:
// - Inline handlers not passed to children: onClick={() => doThing()}
// - Functions not involved in rendering
```

---

## React.memo for Component Memoization

```typescript
import { memo } from "react";

// ✅ Expensive list items
const EmployeeRow = memo(function EmployeeRow({
  employee,
  onSelect,
}: EmployeeRowProps) {
  return (
    <tr onClick={() => onSelect(employee.id)}>
      <td>{employee.name}</td>
      <td>{employee.department}</td>
    </tr>
  );
});

// ✅ With custom comparator
const EmployeeCard = memo(
  function EmployeeCard({ employee, selected }: Props) {
    return <div className={selected ? "ring-2 ring-[#8f58e4]" : ""}>{employee.name}</div>;
  },
  (prev, next) =>
    prev.employee.id === next.employee.id &&
    prev.selected === next.selected
);

// When to use:
// - List items that render frequently
// - Components with expensive rendering
// - Props don't change often
```

---

## Debounced Search

```typescript
import { useState, useMemo } from "react";
import { useEmployees } from "@/hooks/useEmployees";

function EmployeeSearch() {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Simple debounce with useEffect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data = [] } = useEmployees();

  const results = useMemo(() => {
    if (!debouncedQuery) return data;
    const q = debouncedQuery.toLowerCase();
    return data.filter((e) => e.name.toLowerCase().includes(q));
  }, [data, debouncedQuery]);

  return (
    <>
      <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search..." />
      {results.map((e) => <EmployeeRow key={e.id} employee={e} />)}
    </>
  );
}
```

**Timing:**
- 300–500ms: Search/filter
- 1000ms: Auto-save
- 100–200ms: Real-time validation

---

## Memory Leak Prevention

```typescript
// ✅ Always clean up timers
useEffect(() => {
  const id = setInterval(() => fetchStatus(), 30_000);
  return () => clearInterval(id);
}, []);

// ✅ Clean up event listeners
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 0);
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);

// ✅ Cancel async operations on unmount
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/data", { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch((err) => { if (err.name !== "AbortError") console.error(err); });
  return () => controller.abort();
}, []);
```

React Query handles cancellation automatically for queries.

---

## Lazy Load Heavy Libraries

```typescript
// ❌ Top-level import loads library immediately
import jsPDF from "jspdf";

// ✅ Dynamic import only when needed
const handleExportPDF = async () => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.text("Report", 10, 10);
  doc.save("report.pdf");
};

// ✅ GSAP for complex animations — import only on mount
useEffect(() => {
  import("gsap").then(({ gsap }) => {
    gsap.from(".card", { opacity: 0, y: 20, stagger: 0.1 });
  });
}, []);
```

---

## List Keys

```tsx
// ✅ CORRECT — stable unique ID
{employees.map((emp) => (
  <EmployeeCard key={emp.id} employee={emp} />
))}

// ❌ WRONG — index as key breaks reconciliation on reorder/delete
{employees.map((emp, i) => (
  <EmployeeCard key={i} employee={emp} />  // NEVER
))}
```

---

## Next.js Specific

```tsx
// Image optimization via SafeImage component
import SafeImage from "@/components/ui/safe-image";
<SafeImage src={url} alt="Avatar" width={40} height={40} />

// Server Components — no "use client" means static rendering, no JS bundle
export default function StaticPage() {
  return <div>This page ships zero JS</div>;
}

// Avoid "use client" at page level — push it down to interactive leaves
```

---

## Summary

- ✅ `useMemo` — filtering/sorting/transforming large arrays
- ✅ `useCallback` — handlers passed to child components
- ✅ `React.memo` — expensive list items
- ✅ Debounce — 300ms for search, 1s for auto-save
- ✅ Cleanup — always clear timers/listeners in useEffect return
- ✅ Lazy imports — dynamic `import()` for heavy libraries
- ✅ Stable keys — entity IDs, never array index
- ✅ Server Components default — only `"use client"` where needed

**See Also:**
- [component-patterns.md](component-patterns.md) — Component memoization
- [data-fetching.md](data-fetching.md) — React Query caching
