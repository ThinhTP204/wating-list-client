---
name: "Validate Changes"
description: "Run a practical validation checklist based on touched files and report pass/fail with blockers, gaps, and next actions."
argument-hint: "scope of changes or files touched"
---

Validate the current workspace changes.

Input:

- Scope: ${input:scope}

Checklist:

- Run relevant checks first (`lint`, `type-check`, or targeted tests).
- Run broader checks for risky or wide changes (`build` or `validate`).
- If any check fails, summarize root cause and exact next action.
- Explicitly state checks that were not run.

Output:

1. Commands run
2. Pass/fail per command
3. Files/modules most impacted
4. Remaining validation gaps
5. Recommended next check before merge
