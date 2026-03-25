# Routing Guide

Next.js 16 App Router + `?tab=` query param pattern for feature navigation.

---

## Overview

This app uses the **Next.js App Router** with route groups:

| Route Group | Purpose | Auth |
|-------------|---------|------|
| `(landing)` | Public landing page | No |
| `(features)` | Main app features | Yes (middleware) |
| `user/` | User account | Yes (middleware) |

`middleware.ts` protects all routes — unauthenticated users are redirected to login.

---

## Features Tab Navigation

Feature tabs are **NOT separate routes**. They use a single page with a `?tab=` query param.

```
/features?tab=dashboard
/features?tab=calendar
/features?tab=employees
/features?tab=time-keeping
/features?tab=request
/features?tab=salary
/features?tab=task
```

### Layout Pattern (`app/(features)/features/layout.tsx`)

```tsx
// app/(features)/features/layout.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "calendar", label: "Calendar" },
  { id: "employees", label: "Employees" },
  { id: "time-keeping", label: "Time Keeping" },
  { id: "request", label: "Request" },
  { id: "salary", label: "Salary" },
  { id: "task", label: "Task" },
];

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "dashboard";

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="flex gap-1 px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-[#8f58e4] text-[#8f58e4]"
                  : "border-transparent text-muted-foreground hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
```

### Page Component Pattern

```tsx
// app/(features)/features/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import DashboardTab from "./components/dashboard/DashboardTab";
import CalendarTab from "./components/calendar/CalendarTab";
import EmployeesTab from "./components/employees/EmployeesTab";
// ... other tab components

export default function FeaturesPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "dashboard";

  return (
    <div className="p-6">
      {tab === "dashboard" && <DashboardTab />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "employees" && <EmployeesTab />}
      {tab === "time-keeping" && <TimekeepingTab />}
      {tab === "request" && <RequestTab />}
      {tab === "salary" && <SalaryTab />}
      {tab === "task" && <TaskTab />}
    </div>
  );
}
```

---

## Reading Search Params

In Client Components:

```tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function MyComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab");
  const page = Number(searchParams.get("page") ?? "1");

  const navigateToTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };
}
```

In Server Components (page.tsx):

```tsx
// app/(features)/features/page.tsx
interface PageProps {
  searchParams: { tab?: string; page?: string };
}

export default function FeaturesPage({ searchParams }: PageProps) {
  const tab = searchParams.tab ?? "dashboard";
  // ...
}
```

---

## Auth / Middleware

`middleware.ts` protects all `(features)` and `user/` routes.

- Token stored in Redux auth slice
- Axios reads it on every request via interceptor
- 401 response → automatic logout + redirect to login

---

## Navigation Patterns

### Programmatic Navigation

```tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

export function TabSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToEmployees = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "employees");
    router.push(`/features?${params.toString()}`);
  };

  return <button onClick={goToEmployees}>View Employees</button>;
}
```

### Link Component

```tsx
import Link from "next/link";

<Link href="/features?tab=employees">
  Go to Employees
</Link>
```

### Back Navigation

```tsx
import { useRouter } from "next/navigation";
const router = useRouter();
router.back();
```

---

## Summary

- **Tabs**: `?tab=` query param — no separate routes for feature tabs
- **Auth**: `middleware.ts` handles all protected route checks
- **Client Components**: `useSearchParams()` + `useRouter()` for tab navigation
- **Server Components**: Receive `searchParams` as page props
- **No TanStack Router** — this is Next.js App Router only

**See Also:**
- [component-patterns.md](component-patterns.md) — `"use client"` rules
- [common-patterns.md](common-patterns.md) — Auth patterns with Redux
