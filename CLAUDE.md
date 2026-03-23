# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Environment
Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:6789
NEXT_PUBLIC_APP_URL=http://localhost:8989
```
The app defaults to `https://wooki-waitlist.vercel.app` when `NEXT_PUBLIC_API_URL` is not set.

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
- **React Query**: all server state; use `queryKey` arrays from `lib/constants/`.
- **Redux Toolkit + redux-persist**: client state only (auth token, user profile).

### Route structure
```
app/
├── (landing)/          # Public landing page
├── (features)/features/
│   ├── layout.tsx      # Tab nav (dashboard, calendar, employees, time-keeping, request, salary, task)
│   └── components/
│       ├── calendar/
│       ├── dashboard/
│       ├── employees/
│       ├── time-keeping/
│       ├── request/
│       ├── salary/
│       └── task/
└── user/               # User account
```

Tab navigation uses the `?tab=` query param pattern in the features layout.

### Providers (app/layout.tsx order)
1. `ThemeProvider` (next-themes) — light/dark mode
2. `ReduxProvider` — global state
3. `QueryProvider` — React Query client
4. `Toaster` (sonner) — toast notifications

### Component conventions
- Feature components → `app/(features)/features/components/[feature]/`
- Shared UI → `components/ui/` (shadcn, do not edit directly) or `components/layout/`
- Base UI from `@/components/ui/*` (Button, Input, Dialog, Select, etc.)
- Icons: Lucide React preferred; Tabler Icons also available
- Class merging: `cn()` from `@/lib/utils`
- Animations: **Motion v12** (`motion/react`) — use `motion.div`, `AnimatePresence`, `whileHover/whileTap`

### Design system
- Brand colors: `#402093` (deep) · `#5e34b7` (mid) · `#8f58e4` (accent/primary)
- Gradient pattern: `bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4]`
- Always add `dark:` variants — never force a color mode
- Dialog pattern: `p-0 overflow-hidden gap-0` content + gradient header section + scrollable body + footer with border-top

### Auth / middleware
`middleware.ts` protects routes. Token stored in Redux auth slice; Axios reads it on each request. 401 responses trigger automatic logout.
