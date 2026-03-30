# 001 — FSD Architecture

Feature-Sliced Design rules for this project. These override any conflicting guidance in skills or commands.

---

## The 3-Layer Model

```
app/          ← Routing ONLY (pages, layouts, proxy.ts)
features/     ← Domain modules (each owns its hooks, services, types)
shared/       ← Cross-cutting code (api client, shared types, utils)

components/   ← UI primitives (shadcn/ui + shared layout)
lib/          ← Redux store, constants, utils (non-feature)
```

**Golden rule**: `app/` imports from `features/`; `features/` imports from `shared/`; nothing imports upward.

---

## Layer Rules

### `app/` — Routing Only

- **Only** `page.tsx`, `layout.tsx`, `not-found.tsx`, `proxy.ts` live here
- No business logic, no hooks, no API calls in `app/`
- Page components should be thin: import from `features/`, render, done

**Current route map:**
| URL | File | Access |
|-----|------|--------|
| `/` | `app/(landing)/page.tsx` | Public |
| `/login` | `app/login/page.tsx` | Auth only |
| `/admin` | `app/(admin)/admin/page.tsx` | Admin role |
| `/employee` | `app/(employee)/employee/page.tsx` | User role |
| `/user` | `app/user/page.tsx` | Authenticated |

### `features/[name]/` — Domain Modules

Each feature is self-contained:

```
features/
└── [feature-name]/
    ├── hooks/          ← React Query hooks (use[Name].ts)
    ├── services/       ← API service functions ([name]Api.ts)
    ├── types/          ← Feature-specific types (optional)
    └── components/     ← Feature-specific UI (optional, if not in app/)
```

**Current features:**
- `features/waitlist/` — waitlist registration (hooks, services)
- `features/employees/` — employee management (hooks, services)

**Do NOT use these deprecated paths:**
- ~~`hooks/`~~ → `features/[name]/hooks/`
- ~~`lib/api/services/`~~ → `features/[name]/services/`

### `shared/` — Cross-Cutting Code

```
shared/
├── lib/
│   └── api/
│       └── client.ts   ← Axios singleton (THE one import for all API calls)
└── types/
    ├── user.ts
    ├── product.ts
    └── order.ts
```

Use `shared/types/` for types used by **2+ features**. Feature-specific types go in `features/[name]/types/`.

---

## Decision Tree: Where Does My New File Go?

```
Is it a page or route layout?
  YES → app/

Is it used by only one feature?
  YES → features/[name]/[hooks|services|types|components]/

Is it used by multiple features OR is it the API client?
  YES → shared/[lib|types]/

Is it a UI primitive (shadcn or shared layout)?
  YES → components/[ui|layout]/

Is it Redux store, query constants, or utility?
  YES → lib/[redux|constants|utils]/
```

---

## Import Path Reference

| What you need | Import from |
|---------------|-------------|
| Axios singleton | `@/shared/lib/api/client` |
| Shared types | `@/shared/types/[domain]` |
| Feature hook | `@/features/[name]/hooks/use[Name]` |
| Feature service | `@/features/[name]/services/[name]Api` |
| Query keys | `@/lib/constants` |
| Redux store/selectors | `@/lib/redux/store` or `@/lib/redux/slices/authSlice` |
| shadcn UI components | `@/components/ui/[component]` |
| Layout components | `@/components/layout/[component]` |

---

## Scaffolding a New Feature (Quick Reference)

```bash
features/
└── [name]/
    ├── hooks/use[Name].ts         # useQuery + useMutation
    └── services/[name]Api.ts      # fetchX, createX, updateX, deleteX
```

1. **Service first** — define functions + types in `services/[name]Api.ts`
2. **Hook second** — wrap in React Query in `hooks/use[Name].ts`
3. **Constants** — add key to `QUERY_KEYS` in `lib/constants/index.ts`
4. **UI** — either in `app/(admin|employee)/` or `features/[name]/components/`

See `.claude/commands/new-feature.md` for full scaffolding template.
