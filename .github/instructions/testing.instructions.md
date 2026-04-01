---
description: "Use when writing or updating tests, validating code changes, or finishing a task. Enforces deterministic testing, realistic validation order, and transparent completion reporting."
name: "Testing And Validation Workflow"
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---

# Testing And Validation

- Before claiming completion, run relevant checks for changed scope.
- Prefer targeted checks first, then full validation when change is broad.
- Keep tests deterministic and independent from local environment assumptions.

## Commands

- npm run lint
- npm run lint:fix
- npm run type-check
- npm run build
- npm run validate

## Expectations

- Add or update tests for new behavior and bug fixes.
- Cover edge cases and error paths, not only happy path.
- Keep tests deterministic and isolated.
- Do not change tests just to pass broken implementation without clear justification.

## Reporting

- Summarize what was validated and what was not run.
- If a command fails, include the blocker and next concrete action.
- Separate verified facts from assumptions.

## References

- See `../copilot-instructions.md` for global project commands.
- See `../../CLAUDE.md` for stack and workflow context.
