# /review

Review code theo conventions và best practices của dự án Wokki.

**Target**: $ARGUMENTS

## Checklist kiểm tra

### Correctness
- Logic bugs, off-by-one, null/undefined handling
- TypeScript strict: `any` type, missing return types, unsafe assertions

### Conventions
- Naming: PascalCase components, camelCase functions, UPPER_SNAKE constants
- File placement: components đúng folder, hooks trong `hooks/`, services trong `lib/api/services/`
- Imports: dùng `@/` alias, không relative path vượt 2 cấp (`../../..`)
- UI text bằng tiếng Việt

### React Query & State
- `queryKey` arrays từ `lib/constants/` — không hardcode string
- `staleTime` / `gcTime` hợp lý cho từng loại data
- Error / loading states được handle đúng
- Server data → TanStack Query, client state → Redux, UI state → useState

### Performance
- Re-render checks: missing `useMemo` / `useCallback` / `React.memo`
- Bundle imports: `import { X } from 'lucide-react'` thay vì import cả lib
- Heavy components (`recharts`, `three`, `gsap`) nên dùng `next/dynamic`
- Images dùng `next/image` thay vì `<img>`

### Accessibility & UX
- Missing `aria-*` labels, focus rings, keyboard navigation
- Color contrast đạt WCAG AA (đặc biệt trên gradient backgrounds)

### Dark Mode
- Tất cả custom colors có `dark:` variant tương ứng
- Không force color mode — luôn dùng `dark:` prefix

### Security
- XSS: `dangerouslySetInnerHTML` có sanitize không?
- Exposed secrets: không hardcode tokens/keys trong client code

### Next.js
- `"use client"` chỉ khi thực sự cần (hooks, event handlers, browser APIs)
- Missing `<Suspense>` boundaries cho async components
- `next/link` cho internal navigation, không dùng `<a>` thuần

## Output

Danh sách issues theo severity:

```
🔴 CRITICAL (must fix)  — [count]
🟡 WARNING (should fix) — [count]
🟢 SUGGESTION (nice to have) — [count]
```

Mỗi issue gồm: file + line → mô tả vấn đề → gợi ý fix.
