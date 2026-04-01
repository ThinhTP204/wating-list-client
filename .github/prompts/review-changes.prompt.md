---
name: "Review Changes"
description: "Review current code changes for bugs, regressions, architecture violations, and missing tests before merge or handoff."
argument-hint: "review scope, branch base, and risk focus"
---

Review current changes in this workspace.

Input:

- Scope: ${input:scope}
- Risk focus: ${input:risk-focus}

Review priorities:

- Bugs and behavior regressions
- Type safety and async correctness
- Security-sensitive flows
- Missing or weak tests
- Architecture boundary violations (FSD)
- Risky assumptions and unclear requirements

Output:

1. Findings by severity (critical/high/medium/low)
2. File-level evidence for each finding
3. Open questions and assumptions
4. Suggested fixes (minimal diffs)
5. Validation plan to confirm fixes
