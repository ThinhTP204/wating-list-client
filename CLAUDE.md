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
  → React Query hook (features/[name]/hooks/)
    → API service fn (features/[name]/services/)
      → Axios singleton (shared/lib/api/client.ts)
        → NEXT_PUBLIC_API_URL backend
```
- **Axios** (`shared/lib/api/client.ts`): singleton with 10-min timeout, auto-injects `Bearer` token from Redux auth slice, handles 401 logout, exposes `get/post/put/patch/delete/upload`.
- **React Query**: all server state; `queryKey` arrays defined in `lib/constants/`.
- **Redux Toolkit + redux-persist**: client state only (auth token, user profile).

### Project structure

> Architecture: Feature-Sliced Design (FSD). See `.claude/rules/001-fsd-architecture.md`.

```
app/                          ← Routing ONLY
├── (landing)/page.tsx        → URL: /        (public)
├── login/page.tsx            → URL: /login   (auth)
├── (admin)/admin/            → URL: /admin   (admin role)
│   ├── layout.tsx            # Tab nav + logout
│   └── components/           # dashboard, employees, request, salary, time-keeping
├── (employee)/employee/      → URL: /employee (user role)
│   ├── layout.tsx            # Tab nav + logout
│   └── components/           # earnings, shift-swap
├── (features)/features/      → shared components (no page.tsx)
│   └── components/calendar/  # calendar used by both admin & employee
└── user/page.tsx             → URL: /user    (authenticated)

features/                     ← Domain modules (self-contained)
├── waitlist/
│   ├── hooks/                # useRegister, useRegisterDialog
│   └── services/             # fetchRegister
└── employees/
    ├── hooks/                # useEmployees
    └── services/             # employeeApi

shared/                       ← Cross-cutting code
├── lib/api/client.ts         # Axios singleton — import from here, NOT lib/api/core
└── types/                    # user.ts, product.ts, order.ts

components/
├── ui/                       # shadcn components — do not edit directly
└── layout/                   # Shared layout components (Header, Navbar)

lib/
├── redux/slices/authSlice.ts # Auth state
├── constants/index.ts        # QUERY_KEYS
└── utils.ts                  # cn() helper
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
- Order: external packages → `@/lib` → `@/shared` → `@/features` → `@/components`
- `import type { Foo }` for type-only imports

## Design System

- Brand colors: `#102854` (deep navy) · `#1D4D8F` (mid blue) · `#4C88C6` (accent/primary) · `#BCE8F5` (pale blue)
- Gradient: `bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]`
- Always add `dark:` variants — never force a color mode
- Dialog pattern: `p-0 overflow-hidden gap-0` content + gradient header + scrollable body + footer with `border-t`
- Class merging: `cn()` from `@/lib/utils`

### Typography & Sizing

> **Rule:** Never use arbitrary font sizes below `text-xs` (12 px). Specifically: **never write `text-[9px]`, `text-[10px]`, or `text-[11px]`** — they are illegible and inconsistent.

#### Font size scale

| Element | Tailwind class | px | Notes |
|---------|---------------|-----|-------|
| Page / screen title | `text-2xl font-black` | 24 | Main `<h1>` per page |
| Section / panel title | `text-lg font-bold` | 18 | Column headers, drawer titles |
| Card title / person name | `text-base font-semibold` | 16 | Primary label in a card |
| Body / primary content | `text-sm` | 14 | Descriptions, cell text |
| Labels, meta, timestamps | `text-xs` | 12 | ← **hard floor** — do not go smaller |
| Badge text | `text-xs` | 12 | Always `text-xs`, never smaller |
| Uppercase field label | `text-xs font-bold uppercase tracking-wide` | 12 | Section sub-headers inside forms/cards |

Semantic utility classes defined in `globals.css` can be used as shortcuts: `text-page-title`, `text-section-title`, `text-card-title`, `text-body`, `text-meta`, `text-label-upper`.

#### Icon sizing

| Context | Class |
|---------|-------|
| Button icons | `w-4 h-4` |
| Inline text icons (next to body text) | `w-3.5 h-3.5` |
| Chip / badge icons | `w-3 h-3` |
| Section header / decorative | `w-5 h-5` |
| Page header / hero | `w-6 h-6` or larger |

#### Avatar sizing

| Context | Class |
|---------|-------|
| Standard card avatar | `w-11 h-11` (44 px) |
| Small inline / list row | `w-8 h-8` (32 px) |
| Hero / profile ring | `w-20 h-20` (80 px) |

#### Card shell (glassmorphism)

All feature cards follow this base pattern — use the `card-glass` utility from `globals.css` or replicate inline:
```tsx
className="bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-neutral-700/80"
```
Hover: `hover:shadow-lg hover:shadow-[color]/10 hover:border-[color]/50`
Own-item ring: `ring-2 ring-[color]/25 dark:ring-[color]/20`

### Animation libraries
- **Motion v12** (`motion/react`): component-level transitions and micro-interactions — use `motion.div`, `AnimatePresence`, `whileHover`, `whileTap`
- **GSAP v3** (`gsap`): complex multi-step sequences and scroll-triggered animations
- **Icons**: Lucide React preferred; Tabler Icons (`@tabler/icons-react`) also available

## Auth & Route Protection

### proxy.ts (Next.js 16 convention)
Next.js 16 uses `proxy.ts` instead of `middleware.ts` for route interception. The file exports a `proxy` function and a `config` matcher. **Do not create `middleware.ts`** — it is the old convention and will conflict.

Route logic in `proxy.ts`:
- No token → redirect `/login`
- Authenticated + visiting `/`, `/login`, or `/features` → redirect to role default
- `role=admin` → `/admin?tab=dashboard`
- `role=user` → `/employee?tab=calendar`

### Mock auth (demo only)
Login page at `app/login/page.tsx` with two hardcoded accounts:

| Role | Email | Password |
|------|-------|----------|
| admin | `admin@wokki.com` | `admin123` |
| user | `nv@wokki.com` | `nv123` |

On login, two cookies are set: `auth-token` (token value) and `user-role` (role string). The proxy reads `user-role` directly because mock tokens are not real JWTs. When switching to real JWTs, replace the `user-role` cookie read in `proxy.ts` with `jwtDecode`.

### Role-based tab visibility
- **admin** (`app/(admin)/admin/layout.tsx`): Tổng quan, Lịch ca, Nhân viên, Chấm công, Yêu cầu, Lương, Công việc
- **user** (`app/(employee)/employee/layout.tsx`): Lịch ca, Đổi ca, Công việc

### Circular dependency — client.ts
`shared/lib/api/client.ts` must NOT import `store` or `logout` at the top level — this creates a circular dependency (`client → authSlice → client`). Both are imported via `require()` lazily inside the interceptor callbacks.
