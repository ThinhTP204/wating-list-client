---
name: frontend-dev-guidelines
description: Frontend development guidelines for this Next.js/React/TypeScript app. Covers component patterns, data fetching with React Query, Tailwind+shadcn styling, Next.js App Router, design system, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, routing, or working with frontend code.
---

# Frontend Development Guidelines

## Purpose

Comprehensive guide for development in this project: **Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui (new-york) · React Query · Redux Toolkit**.

## When to Use This Skill

- Creating new components or pages
- Building new features
- Fetching data with React Query
- Navigating with Next.js App Router / `?tab=` pattern
- Styling with Tailwind + shadcn/ui
- Adding animations (Motion v12, GSAP)
- TypeScript best practices

---

## Quick Start

### New Component Checklist

- [ ] `"use client"` only if using hooks/event handlers — default to Server Component
- [ ] Explicit prop interface with PascalCase name
- [ ] Use `@/components/ui/*` instead of raw HTML elements
- [ ] Import type-only with `import type { Foo }`
- [ ] Always add `dark:` Tailwind variants
- [ ] Use `cn()` from `@/lib/utils` for conditional classes
- [ ] Use `toast` from `sonner` for user feedback
- [ ] Export default at bottom of file
- [ ] Stable `key` props on lists — never use array index

### New Feature Checklist

- [ ] Feature components → `app/(features)/features/components/[feature]/`
- [ ] API service → `lib/api/services/[feature].ts`
- [ ] React Query hook → `hooks/use[Name].ts`
- [ ] Query keys → `lib/constants/` (never inline strings)
- [ ] TypeScript types → `types/`

---

## Import Alias Quick Reference

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | project root | `import { api } from '@/lib/api/core'` |

Only `@/` is available — no `~types`, `~components`, or `~features` aliases.

### Import Order (per CLAUDE.md)

```typescript
// 1. External packages
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';

// 2. @/lib
import { api } from '@/lib/api/core';
import { QUERY_KEYS } from '@/lib/constants/queryKeys';

// 3. @/hooks
import { useEmployees } from '@/hooks/useEmployees';

// 4. @/components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 5. @/types
import type { Employee } from '@/types/employee';
```

---

## Topic Guides

### 🎨 Component Patterns

**This project uses:**
- `"use client"` directive — only when needed (hooks/events)
- Explicit prop interfaces — PascalCase names
- shadcn/ui primitives — never raw HTML elements
- `cn()` for class merging
- Export default at bottom

**[📖 Complete Guide: resources/component-patterns.md](resources/component-patterns.md)**

---

### 📊 Data Fetching

**Pattern: React Query + Axios singleton**
- `useQuery` / `useMutation` from `@tanstack/react-query`
- API service functions in `lib/api/services/[feature].ts`
- Axios singleton at `lib/api/core.ts` — never create new instances
- Query keys from `lib/constants/` — never inline strings
- `sonner` toast on mutation success/error

**[📖 Complete Guide: resources/data-fetching.md](resources/data-fetching.md)**

---

### 📁 File Organization

**Project structure:**
```
app/
├── (landing)/               # Public landing page
├── (features)/features/
│   ├── layout.tsx           # Tab nav — uses ?tab= query param
│   └── components/
│       ├── dashboard/
│       ├── calendar/
│       ├── employees/
│       ├── time-keeping/
│       ├── request/
│       ├── salary/
│       └── task/
└── user/                    # User account

components/
├── ui/                      # shadcn — DO NOT edit directly
└── layout/                  # Shared layout components

hooks/                       # React Query hooks, named use[Name].ts
lib/
├── api/
│   ├── core.ts              # Axios singleton
│   └── services/            # API service fns per feature
└── constants/               # queryKey arrays
types/                       # TypeScript type definitions
```

**[📖 Complete Guide: resources/file-organization.md](resources/file-organization.md)**

---

### 🎨 Styling

**Tailwind CSS v4 + shadcn/ui + design system:**
- Brand colors: `#402093` · `#5e34b7` · `#8f58e4`
- Gradient: `bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4]`
- Always add `dark:` variants
- `cn()` from `@/lib/utils` for conditional classes
- Dialog pattern: gradient header + scrollable body + `border-t` footer

**[📖 Complete Guide: resources/styling-guide.md](resources/styling-guide.md)**

---

### 🛣️ Routing

**Next.js App Router + `?tab=` pattern:**
- Feature tabs use `?tab=` query param (not separate routes)
- Protected routes via `middleware.ts`
- Page components in `app/(features)/features/` directory

**[📖 Complete Guide: resources/routing-guide.md](resources/routing-guide.md)**

---

### ⏳ Loading & Error States

**Patterns:**
- Loading: `<Skeleton>` from shadcn/ui — keeps layout stable
- Errors: `sonner` toast for user feedback
- `isLoading` from `useQuery` — conditionally render `<Skeleton>` with same layout

**[📖 Complete Guide: resources/loading-and-error-states.md](resources/loading-and-error-states.md)**

---

### ⚡ Performance

- `useMemo` for expensive computations (filter, sort, map)
- `useCallback` for event handlers passed to children
- `React.memo` for expensive components
- Debounced search (300-500ms)
- Cleanup timeouts/intervals in useEffect
- Dynamic imports for heavy libraries

**[📖 Complete Guide: resources/performance.md](resources/performance.md)**

---

### 📘 TypeScript

- Strict mode — no `any`; use specific types or `unknown` with guards
- `import type { Foo }` for type-only imports
- All API response shapes in `types/`
- Explicit prop interfaces with PascalCase names

**[📖 Complete Guide: resources/typescript-standards.md](resources/typescript-standards.md)**

---

### 🔧 Common Patterns

- Auth: Redux auth slice via `useSelector` / `useAppSelector`
- Forms: React Hook Form + Zod validation with shadcn `<Input>` / `<Label>`
- Dialogs: gradient header + scrollable body + `border-t` footer
- Mutations: invalidate related queries + `sonner` toast

**[📖 Complete Guide: resources/common-patterns.md](resources/common-patterns.md)**

---

### 📚 Complete Examples

Full working examples matching this project's stack.

**[📖 Complete Guide: resources/complete-examples.md](resources/complete-examples.md)**

---

## Navigation Guide

| Need to... | Read this resource |
|------------|-------------------|
| Create a component | [component-patterns.md](resources/component-patterns.md) |
| Fetch data | [data-fetching.md](resources/data-fetching.md) |
| Organize files/folders | [file-organization.md](resources/file-organization.md) |
| Style components | [styling-guide.md](resources/styling-guide.md) |
| Set up routing/tabs | [routing-guide.md](resources/routing-guide.md) |
| Handle loading/errors | [loading-and-error-states.md](resources/loading-and-error-states.md) |
| Optimize performance | [performance.md](resources/performance.md) |
| TypeScript types | [typescript-standards.md](resources/typescript-standards.md) |
| Forms/Auth/Dialog | [common-patterns.md](resources/common-patterns.md) |
| See full examples | [complete-examples.md](resources/complete-examples.md) |

---

## Core Principles

1. **shadcn/ui First**: Use `@/components/ui/*` — never raw HTML for interactive elements
2. **`"use client"` Sparingly**: Default to Server Components; add directive only for hooks/events
3. **React Query for Server State**: `useQuery` / `useMutation` — never local state for API data
4. **Query Keys from Constants**: Always from `lib/constants/` — never inline strings
5. **Sonner for Feedback**: `toast.success()` / `toast.error()` after mutations
6. **Dark Mode Always**: Every color must have a `dark:` variant
7. **Single Alias**: Only `@/` — no `~types`, `~components`, `~features`
8. **Design System**: Brand gradient `#402093 → #5e34b7 → #8f58e4`

---

## Modern Component Template (Quick Copy)

```tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getFeatureData } from "@/lib/api/services/featureService";
import type { FeatureData } from "@/types/feature";

interface FeatureCardProps {
  id: string;
  className?: string;
}

export default function FeatureCard({ id, className }: FeatureCardProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.feature(id),
    queryFn: () => getFeatureData(id),
  });

  if (isLoading) {
    return (
      <Card className={cn("p-4", className)}>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full" />
      </Card>
    );
  }

  return (
    <Card className={cn("p-4", className)}>
      <CardHeader>{data?.name}</CardHeader>
      <CardContent>
        <Button variant="brand" onClick={() => setOpen(true)}>
          Action
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

**Skill Status**: Aligned with Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · React Query · Redux Toolkit
