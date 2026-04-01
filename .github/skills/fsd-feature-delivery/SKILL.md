---
name: fsd-feature-delivery
description: Use when creating a new frontend feature or extending an existing one in this Next.js app. Enforces FSD boundaries and the service -> hook -> UI delivery flow with typed APIs and React Query.
---

# FSD Feature Delivery

## Use this skill when

- Building a new feature in `features/[name]/`
- Extending service and hook logic for an existing domain
- Wiring new backend endpoints into UI pages

## Workflow

1. Define API shapes in `features/[name]/services/[name]Api.ts`
2. Implement typed service functions using `@/shared/lib/api/client`
3. Add/update query keys in `@/lib/constants/index.ts`
4. Build typed hooks in `features/[name]/hooks/use[Name].ts`
5. Integrate UI from `app/` with thin routing components

## Rules

- Keep `app/` routing-only.
- Use named exports in services and hooks.
- Use `ApiError` from `@/shared/lib/api/client` for React Query error type.
- Query keys must come from `QUERY_KEYS`.
- Mutations should include invalidate + success toast + error toast.
- Prefer `import type` for type-only imports.

## References

- `CLAUDE.md`
- `.claude/rules/001-fsd-architecture.md`
- `.claude/rules/002-coding-standards.md`
- `.github/instructions/frontend.instructions.md`
