---
name: "FSD Architecture Boundaries"
description: "Use when creating or moving frontend modules. Enforces Feature-Sliced boundaries, ownership rules, and import direction across app, features, and shared."
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Architecture Boundaries

Follow Feature-Sliced Design direction:

- `app/` for routing files only.
- `features/` for domain hooks/services/types/components.
- `shared/` for cross-feature API client and shared types.

Import direction must stay one-way:

- `app` -> `features` -> `shared`
- Never import upward across layers.

Placement rules:

- New service: `features/[name]/services/[name]Api.ts`
- New hook: `features/[name]/hooks/use[Name].ts`
- Shared types for 2+ features: `shared/types/`
- Feature-only types: `features/[name]/types/`

Critical gotchas:

- Use `proxy.ts` for route interception (Next.js 16), not `middleware.ts`.
- In `shared/lib/api/client.ts`, avoid top-level Redux imports to prevent circular dependencies.
