# Workspace Agent Kit (.github)

This folder mirrors the same separation model used in `.claude`, optimized for Copilot Chat:

- `instructions/`: always-on or scoped rules (the "policy layer")
- `skills/`: reusable workflows (the "execution playbooks")
- `prompts/`: slash commands with task arguments (the "task shortcuts")

## Use This Decision Tree

- Need global or file-scoped behavior enforcement -> `instructions/`
- Need repeatable multi-step workflow -> `skills/`
- Need one focused task quickly in chat -> `prompts/`

## Catalog

### Rules (`instructions/`)

- `architecture.instructions.md`: FSD boundaries and import direction
- `frontend.instructions.md`: frontend development guardrails
- `testing.instructions.md`: deterministic testing and validation reporting
- `quality-gate.instructions.md`: completion claims require verification evidence

### Skills (`skills/`)

- `fsd-feature-delivery/SKILL.md`: service -> hook -> UI delivery flow
- `ui-polish/SKILL.md`: visual and interaction polish without behavior changes
- `completion-gate/SKILL.md`: final verification before completion claims
- `review-gate/SKILL.md`: review findings + fix loop + completion gate

### Slash Commands (`prompts/`)

- `new-feature.prompt.md`: scaffold a feature module
- `generate-hook.prompt.md`: generate typed React Query hooks
- `enhance-ui.prompt.md`: improve component UI/UX
- `review-changes.prompt.md`: review regressions, risk, and test gaps
- `validate-changes.prompt.md`: run practical validation checklist
- `address-review.prompt.md`: convert review feedback into a concrete fix plan

## Recommended Daily Flow

1. Implement using `new-feature` or `generate-hook`
2. Polish UX with `enhance-ui` when needed
3. Review diffs using `review-changes`
4. Validate via `validate-changes`
5. Final claim only after `completion-gate` skill protocol

## Authoring Standards

- Keep `description` explicit with trigger phrases (`Use when ...`).
- Prefer narrow `applyTo` globs over `"**"`.
- Keep prompts single-purpose and argument-driven.
- Keep skills reusable and workflow-oriented.
- Keep output sections deterministic: findings, actions, validation, risks.
