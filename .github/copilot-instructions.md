# Copilot Instructions

## Project Context

- This is a frontend-only application built with Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, and shadcn/ui.
- All backend communication goes through external REST APIs via the shared Axios client.

## Architecture Rules (FSD)

- Keep `app/` for routing only (pages/layouts/not-found/proxy).
- Put domain logic in `features/[name]/` (hooks, services, types, feature components).
- Put cross-feature/shared code in `shared/` (API client, shared types).
- Use `components/ui/` and `components/layout/` for reusable UI/layout pieces.
- Do not import upward across layers.

## Data Flow

- Component -> React Query hook -> feature service -> `shared/lib/api/client.ts` -> backend API

## Routing and Auth

- Route protection is handled in `proxy.ts` (Next.js 16).
- Do not create `middleware.ts`.

## Coding Conventions

- Use TypeScript strict-safe types; avoid `any`.
- Prefer `import type` for type-only imports.
- Use `@/` alias for internal imports.
- Import order:
  1. External packages
  2. `@/lib`
  3. `@/shared`
  4. `@/features`
  5. `@/components`
  6. Relative imports

## React Query and Services

- Define query keys from `lib/constants/index.ts`; never inline key strings.
- Feature hooks must use proper `enabled` guards when critical params are required.
- Place API service functions in `features/[name]/services/[name]Api.ts` with explicit request/response types.

## UI Rules

- Prefer existing components in `components/ui/*` over raw HTML controls.
- Keep styling consistent with existing design system and utility classes.
- Add `dark:` variants when introducing new color styles.

## Safety Notes

- Avoid circular dependency in `shared/lib/api/client.ts`; do not top-level import Redux store/actions there.
- Keep changes small, focused, and consistent with existing patterns.
