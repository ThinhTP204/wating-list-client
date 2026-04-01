---
name: review-gate
description: Use when reviewing code changes, handling review feedback, or preparing a final completion claim. Enforces findings-first review output, fix prioritization, and verification evidence before status claims.
---

# Review Gate

## Use this skill when

- A task just finished implementation
- You need a structured code review pass
- Review comments were received and need technical triage
- You are about to claim completion or suggest merge

## Review protocol

1. Inspect changed scope and identify findings first
2. Prioritize by severity: critical -> high -> medium -> low
3. List missing tests and regression risks
4. Provide minimal-diff fix actions
5. Re-verify with at least one relevant command

## Findings output format

- Findings by severity (with file references)
- Open questions or assumptions
- Proposed fix plan
- Validation commands and outcomes
- Remaining risks

## Completion claim gate

Before saying done:

1. Run a relevant verification command (`lint`, `type-check`, `build`, or `validate`)
2. Report what changed
3. Report what was verified
4. Report what was not verified
5. Report known risks or follow-up
