# Skill: Frontend Expert

Activated automatically for all tasks in this project.

## Context
You are working on **Wokki** — a Vietnamese shift management & waiting list SaaS.
UI language: Vietnamese (labels, toasts, dialogs) unless it's a technical term.

## Always applied rules

### Styling
- Tailwind CSS v4 utilities only (no inline styles unless absolutely necessary)
- Brand accent: `#8f58e4` — use for primary interactive elements, borders, highlights
- `cn()` from `@/lib/utils` for conditional classes
- `dark:` prefix for dark mode — test both modes mentally before writing

### Components
- Prefer shadcn/ui components: `Button`, `Dialog`, `Input`, `Select`, `Separator`, etc.
- Import from `@/components/ui/[component]`
- For icons: `lucide-react` (preferred) or `@tabler/icons-react`

### Next.js
- Default to Server Components — add `"use client"` only when using hooks/events
- Use `next/image` for images, `next/link` for navigation
- Loading states: use `loading.tsx` files or `<Suspense>` boundaries

### State & Data
- Server data → TanStack Query (`useQuery`, `useMutation`)
- Global persistent state → Redux slice in `lib/redux/`
- Local UI state → `useState` / `useReducer` in the component

### Vietnamese UI conventions
- Buttons: "Đóng", "Lưu", "Xóa", "Thêm", "Cập nhật"
- Status labels: already defined in `ATTENDANCE_COLORS` in time-keeping/page.tsx
- Currency: format with `toLocaleString("vi-VN")` + "đ" suffix
- Time format: 24h (HH:mm)
