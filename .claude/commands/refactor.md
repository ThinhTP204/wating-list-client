# /refactor

Refactor existing code while preserving conventions and behavior.

## Usage
```
/refactor [paste code or file path]
```

## What I will do
1. Preserve all existing naming conventions and TypeScript types
2. Extract repeated logic into helpers (only if used 3+ times)
3. Split large components (>200 lines) into smaller focused ones
4. Replace verbose patterns with idiomatic React 19 / Next.js 16 equivalents
5. Improve readability without changing external API/props
6. Keep the same file structure — will NOT move files unless asked

## What I will NOT do
- Change tech stack or swap libraries
- Add new features or behavior
- Add unnecessary abstraction layers
