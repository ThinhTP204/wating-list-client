---
name: completion-gate
description: Use when preparing a final answer after code changes. Enforces verification evidence, honest reporting of unrun checks, and clear risk communication.
---

# Completion Gate

## Use this skill when

- About to say a task is done
- About to suggest merge or handoff
- Summarizing test/build status

## Minimum protocol

1. Run a relevant verification command for changed scope
2. Capture pass/fail result
3. Report exactly what was validated
4. Report exactly what was not validated
5. State blockers and next steps if failures occur

## Suggested commands

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run validate`

## Output template

- Changes completed
- Verification run
- Not run
- Risks and follow-up
