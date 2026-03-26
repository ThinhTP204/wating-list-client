# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:6789
NEXT_PUBLIC_APP_URL=http://localhost:8989
```
Defaults to `https://wooki-waitlist.vercel.app` when `NEXT_PUBLIC_API_URL` is not set.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run type-check   # TypeScript check (no emit)
npm run validate     # format + lint + type-check combined
```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/new-feature [name]` | Scaffold a full feature (components + service + hook + types) |
| `/generate-hook [resource] [--mutation]` | Generate typed React Query hook |
| `/enhance-ui [file]` | Cải thiện visual quality, animation, UX của component hiện có |

## Architecture

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui (new-york)

This is a **frontend-only** app — no API routes. All backend calls go to an external REST API.

### Data flow
```
Component
  → React Query hook (hooks/)
    → API service fn (lib/api/services/)
      → Axios singleton (lib/api/core.ts)
        → NEXT_PUBLIC_API_URL backend
```
- **Axios** (`lib/api/core.ts`): singleton with 10-min timeout, auto-injects `Bearer` token from Redux auth slice, handles 401 logout, exposes `get/post/put/patch/delete/upload`.
- **React Query**: all server state; `queryKey` arrays defined in `lib/constants/`.
- **Redux Toolkit + redux-persist**: client state only (auth token, user profile).

### Project structure
```
app/
├── (landing)/               # Public landing page
├── (features)/features/
│   ├── layout.tsx           # Tab nav — dashboard, calendar, employees, time-keeping, request, salary, task
│   └── components/
│       ├── calendar/
│       ├── dashboard/
│       ├── employees/
│       ├── time-keeping/
│       ├── request/
│       ├── salary/
│       └── task/
└── user/                    # User account

components/
├── ui/                      # shadcn components — do not edit directly
└── layout/                  # Shared layout components

hooks/                       # React Query hooks, named use[Name].ts
lib/
├── api/
│   ├── core.ts              # Axios singleton
│   └── services/            # API service functions per feature
└── constants/               # queryKey arrays for React Query
types/                       # TypeScript type definitions
```

Tab navigation uses the `?tab=` query param pattern in the features layout.

### Providers (`app/layout.tsx` order)
1. `ThemeProvider` (next-themes) — light/dark mode
2. `ReduxProvider` — global state
3. `QueryProvider` — React Query client
4. `Toaster` (sonner) — toast notifications

## Coding Conventions

### TypeScript
- Strict mode — no `any`; use specific types or `unknown` with type guards
- Explicit prop interfaces with PascalCase names
- `import type { Foo }` for type-only imports
- All API response shapes typed in `types/`

### Components
- `"use client"` only when the component uses hooks or event handlers; default to Server Components
- Proper `key` props on lists — never use array index for mutable lists
- Export default at bottom of file
- Feature components → `app/(features)/features/components/[feature]/`
- Shared UI → `components/ui/` (shadcn) or `components/layout/`

### UI component priority — always prefer `@/components/ui/*` over raw HTML

| Raw HTML | Use instead |
|----------|-------------|
| `<button>` | `<Button>` — variants: `brand`, `brand-outline`, `outline`, `ghost`, `destructive` |
| `<input>` | `<Input>` |
| `<select>` + `<option>` | `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` |
| `<label>` | `<Label>` |
| `<table>` / `<thead>` / `<tr>` / `<td>` | `<Table>` / `<TableHeader>` / `<TableRow>` / `<TableCell>` |
| `<hr>` | `<Separator>` |
| `<img>` | `<SafeImage>` |
| loading placeholder div | `<Skeleton>` |
| status pill / tag | `<Badge>` — variants: `default`, `secondary`, `outline`, `destructive` |
| card wrapper div | `<Card>` + `<CardHeader>` + `<CardContent>` + `<CardFooter>` |
| modal/popup | `<Dialog>` + `<DialogContent>` + `<DialogTitle>` |
| chart/graph | `<chart.tsx>` (wraps Recharts) |

Only use raw HTML when no UI component covers the semantic need (e.g. `<section>`, `<article>`, layout wrappers).

### State & data fetching
- Server state: React Query (`@tanstack/react-query`)
- Client state: Redux Toolkit (auth token, user profile only)
- `queryKey` arrays always from `lib/constants/` — never inline strings
- Mutations: invalidate related queries on success + `sonner` toast feedback

### Imports
- Always use `@/` alias for internal paths
- Order: external packages → `@/lib` → `@/hooks` → `@/components` → `@/types`

## Design System

- Brand colors: `#102854` (deep navy) · `#1D4D8F` (mid blue) · `#4C88C6` (accent/primary) · `#BCE8F5` (pale blue)
- Gradient: `bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]`
- Always add `dark:` variants — never force a color mode
- Dialog pattern: `p-0 overflow-hidden gap-0` content + gradient header + scrollable body + footer with `border-t`
- Class merging: `cn()` from `@/lib/utils`

### Animation libraries
- **Motion v12** (`motion/react`): component-level transitions and micro-interactions — use `motion.div`, `AnimatePresence`, `whileHover`, `whileTap`
- **GSAP v3** (`gsap`): complex multi-step sequences and scroll-triggered animations
- **Icons**: Lucide React preferred; Tabler Icons (`@tabler/icons-react`) also available

## Auth / Middleware

`middleware.ts` protects routes. Token stored in Redux auth slice; Axios reads it on each request. 401 responses trigger automatic logout.
