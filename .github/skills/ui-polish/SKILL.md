---
name: ui-polish
description: Use when improving visual quality of an existing component without changing business behavior. Focuses on hierarchy, spacing, interaction states, loading and empty states, and motion clarity.
---

# UI Polish

## Use this skill when

- User asks to improve look and feel
- Existing UI works but lacks clarity or consistency
- A component needs better loading, empty, or error states

## Checklist

1. Keep behavior and data flow unchanged
2. Improve typography hierarchy and spacing rhythm
3. Add complete interaction states (hover/focus-visible/disabled)
4. Ensure color tokens include `dark:` variants
5. Add meaningful motion with restraint
6. Prefer `@/components/ui/*` primitives over raw controls

## Guardrails

- Do not rename public props or break call sites.
- Do not add unnecessary dependencies.
- Keep styles aligned with project brand in `CLAUDE.md`.

## References

- `CLAUDE.md`
- `.github/instructions/frontend.instructions.md`
