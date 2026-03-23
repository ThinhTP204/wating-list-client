# /optimize

Phân tích và tối ưu performance cho component/page.

**Target**: $ARGUMENTS

## Checklist phân tích

### 🔄 Re-renders
- Inline object/array/function trong JSX → khai báo ngoài hoặc `useMemo`/`useCallback`
- Component nhận props thay đổi reference mỗi render → `React.memo` wrapper
- Context provider value thay đổi mỗi render → `useMemo` cho value
- Missing `key` prop hoặc dùng index-as-key khi list thay đổi

### 📦 Bundle Size
- Import toàn bộ library thay vì tree-shake:
  ```diff
  - import { Calendar } from 'lucide-react'
  + import Calendar from 'lucide-react/dist/esm/icons/calendar'
  ```
  *(Lưu ý: lucide-react đã tree-shake tốt, nhưng các lib khác thì kiểm tra)*
- Heavy libraries cần `next/dynamic`:
  - `recharts` → dynamic import cho chart components
  - `three` / `@react-three/fiber` → dynamic import với `ssr: false`
  - `gsap` → dynamic import khi chỉ dùng ở một vài page

### 🖼️ Images & Media
- `<img>` → `next/image` (auto optimize, lazy loading, responsive)
- Missing `width`/`height` gây layout shift
- Large images không có `sizes` prop

### ⚡ Data Fetching
- React Query không set `staleTime` → refetch không cần thiết mỗi focus
- Waterfall requests → dùng `useQueries` cho parallel fetching
- Large lists không paginate/virtualize

### 🧩 Code Splitting
- Components chỉ hiển thị conditional (dialogs, modals, tabs) → `next/dynamic`
- Route segments nặng → `loading.tsx` + `<Suspense>`

## Output

```
📊 Performance Report

🔴 High Impact  — [count]
🟡 Medium Impact — [count]
🟢 Low Impact   — [count]

[Chi tiết từng issue + code fix]

Estimated improvement: [mô tả impact tổng thể]
```
