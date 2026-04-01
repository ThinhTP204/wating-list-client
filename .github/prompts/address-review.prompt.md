---
name: "Address Review Feedback"
description: "Turn code review comments into a prioritized fix plan, then implement and verify with minimal diffs."
argument-hint: "review comments or issue list, affected scope, risk focus"
---

Resolve review feedback in this workspace with a verification-first approach.

Input:

- Review feedback: ${input:feedback}
- Affected scope: ${input:scope}
- Risk focus: ${input:risk-focus}

Process:

1. Classify each item by severity (critical/high/medium/low).
2. Identify unclear or conflicting comments and state assumptions.
3. Produce a minimal-diff fix plan.
4. Implement fixes in the smallest safe scope.
5. Run at least one relevant validation command.

Output:

1. Prioritized review findings
2. Exact files changed
3. Fixes applied per finding
4. Validation commands run and outcomes
5. Remaining risks or deferred items
