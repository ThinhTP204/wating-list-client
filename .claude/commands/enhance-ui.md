# /enhance-ui

Nâng cấp visual quality và UX cho component hiện có mà không thay đổi logic.

**Target**: $ARGUMENTS

## Quy trình

1. **Đọc & phân tích** component hiện tại — xác định điểm yếu visual
2. **Brand consistency** — sử dụng đúng brand tokens:
   - Primary: `#8f58e4` — interactive elements, borders, highlights
   - Gradient: `bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4]`
   - Sử dụng `cn()` từ `@/lib/utils` cho conditional classes
3. **Dark mode** — bổ sung mọi `dark:` variant còn thiếu, kiểm tra contrast
4. **Typography & spacing** — chuẩn hóa font-size scale, padding/margin consistency
5. **Micro-interactions** — hover/focus/active states bằng Tailwind transitions
6. **Motion** — entrance/exit animations bằng Motion v12 (`motion/react`):
   - `motion.div` với `initial/animate/exit`
   - `AnimatePresence` cho conditional renders
   - `whileHover`/`whileTap` cho interactive elements
7. **Responsive** — kiểm tra `sm:` → `md:` → `lg:` → `xl:`, fix overflow/truncation
8. **Accessibility** — `aria-*` labels, focus rings (`focus-visible:ring-2`), keyboard nav

## Checklist trước khi output

- [ ] Mọi hardcoded color → dùng brand tokens hoặc Tailwind semantic colors
- [ ] Mọi interactive element có `dark:` variant
- [ ] Sử dụng shadcn components (`@/components/ui/*`) thay vì tự build
- [ ] Icons từ `lucide-react` (ưu tiên) hoặc `@tabler/icons-react`
- [ ] Không inline styles — chỉ Tailwind utilities
- [ ] Text UI bằng tiếng Việt

## Không làm

- Thay đổi component logic, data flow, hoặc props interface
- Thêm feature mới
- Swap libraries

## Output

Full rewritten JSX/TSX — drop-in replacement, cùng props interface. Giải thích ngắn gọn các thay đổi visual chính ở đầu.
