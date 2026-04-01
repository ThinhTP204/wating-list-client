---
description: "Scaffold a new feature module with services hooks query keys and integration checklist following FSD conventions."
name: "Scaffold New Feature"
argument-hint: "feature name, objective, and target screen"
agent: "agent"
---

Create a production-ready feature scaffold for this workspace.

Input:

- Feature name: ${input:feature-name}
- Objective: ${input:objective}
- Target screen or route: ${input:target}

Requirements:

- Follow FSD boundaries from .claude/rules/001-fsd-architecture.md.
- Create service first at features/[name]/services/[name]Api.ts with explicit request and response types.
- Create React Query hook at features/[name]/hooks/use[Name].ts.
- Add needed query keys in lib/constants/index.ts.
- Use shared api client at shared/lib/api/client.ts.
- Use import type for type-only imports.
- Add toast success and error behavior for mutations when appropriate.
- Keep file and symbol names consistent with existing project conventions.

Output format:

1. Files to create or update
2. Proposed TypeScript interfaces
3. Hook and service signatures
4. Integration steps in target page or component
5. Validation checklist with exact commands to run

References:

- .github/copilot-instructions.md
- CLAUDE.md
- .claude/rules/002-coding-standards.md
