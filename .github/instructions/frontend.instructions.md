---
description: "Use when creating or editing frontend code in Next.js React TypeScript files. Enforces FSD boundaries, React Query data flow, shadcn ui usage, import order, and project-specific gotchas."
name: "Frontend FSD Guardrails"
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Frontend Guardrails

- Respect layer direction: app -> features -> shared.
- Keep app routing-only files thin and move business logic into features.
- Follow data flow: component -> hook -> service -> shared api client.
- Prefer components in components/ui over raw interactive HTML.
- React Query keys must come from lib/constants/index.ts.
- Feature services go in features/[name]/services/[name]Api.ts with explicit request and response types.
- Use strict-safe TypeScript and import type where applicable.
- Import order:
  1. External packages
  2. @/lib
  3. @/shared
  4. @/features
  5. @/components
  6. Relative imports
- Add dark variants for new color styles.

## Critical Gotchas

- Use proxy.ts for interception in Next.js 16; do not create middleware.ts.
- Avoid top-level Redux imports in shared/lib/api/client.ts to prevent circular dependency.
- Avoid deprecated paths such as hooks at root and lib/api/services for domain logic.

## References

- See ../copilot-instructions.md for project-wide rules.
- See ../../CLAUDE.md for design system and auth notes.
- See ../../.claude/rules/001-fsd-architecture.md for architecture boundaries.
- See ../../.claude/rules/002-coding-standards.md for service and hook standards.
