# Workspace Agent Guidelines

Use this file as the top-level map for the `.github` customization system.

## Structure

- `instructions/`: rules with `applyTo` scope (always-on or file-scoped)
- `skills/`: reusable multi-step workflows loaded on demand
- `prompts/`: slash commands for focused tasks

Preferred execution sequence for non-trivial tasks:

1. Follow `instructions/` constraints first.
2. Load matching `skills/` workflow if task matches.
3. Use `prompts/` for focused execution and standardized output.

See `.github/README.md` for the full catalog.

## Stack And Scope

- Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui.
- Frontend-only app. Do not create Next.js API routes for backend business logic.

## Core Architecture

- Respect Feature-Sliced boundaries:
  - `app/` is routing-only.
  - `features/` owns domain hooks/services/types/components.
  - `shared/` owns cross-feature API client and shared types.
- Keep import direction one-way: `app` -> `features` -> `shared`.
- Data flow: component -> React Query hook -> feature service -> `shared/lib/api/client.ts` -> backend API.

## Implementation Standards

- Use strict-safe TypeScript and avoid `any`.
- Use `import type` for type-only imports.
- Use `@/` alias for internal imports.
- Import order:
  1. External packages
  2. `@/lib`
  3. `@/shared`
  4. `@/features`
  5. `@/components`
  6. Relative imports
- React Query keys come from `lib/constants/index.ts`.
- Feature services live at `features/[name]/services/[name]Api.ts`.
- Prefer `components/ui/*` over raw interactive controls.
- Add `dark:` variants for new color styles.

## Critical Gotchas

- Route interception uses `proxy.ts` in Next.js 16. Do not create `middleware.ts`.
- In `shared/lib/api/client.ts`, avoid top-level Redux imports to prevent circular dependencies.

## Validation Commands

Run relevant checks based on change scope:

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run validate`

## Review And Completion

- Before completion claims, present review findings first when asked to review.
- Always report:
  - what changed,
  - what was verified,
  - what was not verified,
  - known risks and follow-up.

## Source Of Truth

- `CLAUDE.md`
- `.claude/rules/001-fsd-architecture.md`
- `.claude/rules/002-coding-standards.md`
- `SETUP.md`
