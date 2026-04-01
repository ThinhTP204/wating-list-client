# Project Guidelines

## Build And Validate

Run these commands when relevant changes are made:

```bash
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run format
npm run type-check
npm run validate
```

## Architecture

- Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui.
- This is a frontend-only app. Do not create Next.js API routes for backend business logic.
- Feature-Sliced boundaries must be respected:
  - `app/` is routing-only.
  - `features/` contains domain hooks/services/types/components.
  - `shared/` contains cross-feature API client and shared types.
  - Do not import upward across layers.
- Data flow: Component -> React Query hook -> feature service -> `shared/lib/api/client.ts` -> external backend API.

## Conventions

- Use strict-safe TypeScript. Avoid `any`.
- Prefer `import type` for type-only imports.
- Use `@/` alias for internal imports.
- Import order:
  1. External packages
  2. `@/lib`
  3. `@/shared`
  4. `@/features`
  5. `@/components`
  6. Relative imports
- React Query keys must come from `lib/constants/index.ts`.
- Feature services must live in `features/[name]/services/[name]Api.ts` with explicit request/response types.
- Prefer `components/ui/*` over raw interactive HTML controls.
- Add `dark:` variants for new color styles.

## Critical Gotchas

- Route interception uses `proxy.ts` (Next.js 16). Do not create `middleware.ts`.
- In `shared/lib/api/client.ts`, do not top-level import Redux store/actions (circular dependency risk).
- Avoid deprecated paths for domain logic; keep hooks/services in `features/[name]/...`.

## Source Of Truth Docs

- `../CLAUDE.md` for setup, design system, auth notes, and detailed conventions.
- `../.claude/rules/001-fsd-architecture.md` for architecture boundaries.
- `../.claude/rules/002-coding-standards.md` for service/hook/type standards.
- `../SETUP.md` for setup walkthrough.
