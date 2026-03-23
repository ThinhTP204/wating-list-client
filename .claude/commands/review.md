# /review

Review code against this project's conventions and best practices.

## Usage
```
/review [paste code or file path]
```

## What I will check
1. **Correctness**: logic bugs, off-by-one errors, type safety issues
2. **Conventions**: naming, file placement, import paths (`@/` alias usage)
3. **Performance**: unnecessary re-renders, missing `useMemo`/`useCallback`, large bundle imports
4. **Accessibility**: missing aria labels, keyboard navigation, color contrast
5. **Security**: XSS risks, unsanitized user input, exposed secrets
6. **Dark mode**: missing `dark:` variants, hardcoded colors
7. **Next.js specifics**: unnecessary `"use client"`, missing Suspense boundaries

Output format: bullet list of issues grouped by severity (🔴 critical / 🟡 warning / 🟢 suggestion).
