---
name: "Generate Typed Hook"
description: "Create or update a typed React Query hook for a feature service with correct query keys and error typing."
argument-hint: "feature name, resource name, and whether mutation is needed"
---

Generate a React Query hook in this workspace.

Input:

- Feature: ${input:feature}
- Resource: ${input:resource}
- Mode: ${input:mode} (query|mutation|both)

Requirements:

- Use `features/[feature]/hooks/use[Resource].ts`.
- Reuse service functions from `features/[feature]/services/[feature]Api.ts`.
- Use `QUERY_KEYS` from `@/lib/constants`.
- Use `ApiError` from `@/shared/lib/api/client`.
- Add `enabled` guard for queries.
- For mutations: invalidate queries and show Vietnamese success/error toast.
- Preserve import order and use `import type` where applicable.

Output:

1. Files changed
2. Hook signatures
3. Query key strategy
4. Integration note for caller components
