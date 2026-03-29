# /enhance-ui

Cải thiện giao diện của một component hiện có — nâng cao visual quality, animation, và UX mà không thay đổi behavior.

**Usage**: `/enhance-ui [file hoặc component name]`

## Quy trình

1. **Đọc code** — hiểu component hiện tại: layout, state, props, data flow
2. **Phân tích điểm yếu**:
   - Spacing/rhythm inconsistent
   - Màu sắc không theo design system hoặc thiếu `dark:` variants
   - Thiếu hover/focus-visible/active/disabled states
   - Thiếu loading skeleton, empty state, error state
   - Animation đột ngột hoặc không có
   - Typography hierarchy chưa rõ
3. **Áp dụng cải thiện** theo thứ tự ưu tiên:

### Visual polish
- Brand gradient: `bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]` cho header/accent
- Button variants có sẵn — dùng đúng variant thay vì custom class:
  - `variant="brand"` — gradient primary action
  - `variant="brand-outline"` — outlined secondary
  - `variant="outline"` / `variant="ghost"` / `variant="destructive"`
- Luôn thêm `dark:` cho mọi màu custom; không dùng Tailwind color mà không có dark variant
- Border radius, shadow, spacing theo Tailwind scale — tránh arbitrary khi có sẵn
- Typography: heading size → weight → tracking rõ ràng theo hierarchy

### Interaction states
- `hover:` và `active:` cho mọi interactive element
- `focus-visible:ring-2 focus-visible:ring-[#4C88C6]` cho keyboard navigation
- `disabled:opacity-50 disabled:pointer-events-none` khi cần
- `transition-colors duration-200` hoặc `transition-all duration-200` cho smooth feel

### Animation với Motion v12 (`motion/react`)
```tsx
import { motion, AnimatePresence } from 'motion/react'

// Mount/unmount
<AnimatePresence mode="popLayout">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>

// Stagger list
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
}

// Micro-interactions
<motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>

// List với layout animation
<motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
```

GSAP (`gsap`) — chỉ dùng cho sequences phức tạp nhiều bước hoặc scroll-triggered; không dùng thay thế Motion cho UI thông thường.

### Empty & loading states
- **Skeleton**: dùng `<div className="animate-pulse bg-muted rounded-md h-4 w-full">` khi biết layout
- **Empty state**: icon (lucide-react) + message + CTA button nếu applicable
- **Error state**: message + retry button gọi lại query

### Dialog/Sheet pattern
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
    <DialogTitle className="sr-only">[Title for screen readers]</DialogTitle>
    {/* Gradient header */}
    <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-5 pt-5 pb-4 text-white">
      ...
    </div>
    {/* Scrollable body */}
    <div className="px-4 py-3 space-y-3 overflow-y-auto max-h-[60vh]">
      ...
    </div>
    {/* Footer */}
    <div className="px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
      ...
    </div>
  </DialogContent>
</Dialog>
```

## UI component map — thay thế raw HTML bằng component có sẵn

| Raw HTML | Component (`@/components/ui/*`) |
|----------|----------------------------------|
| `<button>` | `<Button variant="brand\|brand-outline\|outline\|ghost\|destructive">` |
| `<input>` | `<Input>` |
| `<select>` | `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` |
| `<label>` | `<Label>` |
| `<table>` / `<tr>` / `<td>` | `<Table>` / `<TableHeader>` / `<TableRow>` / `<TableCell>` |
| `<hr>` | `<Separator>` |
| `<img>` | `<SafeImage>` |
| loading placeholder | `<Skeleton>` |
| status tag / pill | `<Badge variant="default\|secondary\|outline\|destructive">` |
| card wrapper | `<Card>` + `<CardHeader>` + `<CardContent>` + `<CardFooter>` |
| modal | `<Dialog>` + `<DialogContent>` + `<DialogTitle className="sr-only">` |
| chart | `@/components/ui/chart` (wraps Recharts) |

Raw HTML chỉ giữ lại cho layout semantics (`<section>`, `<article>`, flex/grid wrapper `<div>`).

## Rules

- **Không** thay đổi logic, props interface, hoặc data fetching
- **Không** thêm dependencies mới
- **Không** đổi tên component hoặc file
- Nếu phát hiện bug khi đọc — báo rõ nhưng không tự sửa
- Dùng `cn()` từ `@/lib/utils` cho conditional classes
- Icons: `lucide-react` preferred; `@tabler/icons-react` khi cần icon đặc biệt hơn

## Output

1. **Danh sách thay đổi** — bullet list ngắn theo category (visual, animation, states)
2. **Full component** đã cải thiện, sẵn sàng thay thế file gốc
