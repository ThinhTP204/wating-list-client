---
name: "Enhance UI"
description: "Polish an existing component visual design and UX states without changing business logic."
argument-hint: "target file path and UX goal"
---

Improve the selected component UI quality.

Input:

- Target file: ${input:file}
- UX goal: ${input:goal}

Requirements:

- Keep behavior and data flow unchanged.
- Improve typography hierarchy, spacing, and contrast.
- Add missing interaction states (hover/focus-visible/disabled).
- Add loading/empty/error visual states when relevant.
- Prefer `@/components/ui/*` primitives.
- Keep dark mode support with `dark:` variants.

Output:

1. Visual improvements made
2. State handling improvements
3. Accessibility and interaction upgrades
4. Any risks if logic was intentionally untouched
