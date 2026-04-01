---
name: "Completion Verification Gate"
description: "Use when wrapping up implementation, before claiming success, or before suggesting merge. Requires concrete verification evidence and clear reporting of what was and was not validated."
applyTo: "**/*"
---

# Completion Gate

Before claiming a task is complete:

- Run at least one relevant verification command for the changed scope.
- Prefer targeted checks first, then broader checks for wide changes.
- If anything was not run, state it explicitly.
- If a command fails, report the blocker and immediate next step.

## Verification options

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run validate`

## Claim format

- What changed
- What was verified
- What was not verified
- Known risks or follow-up actions
