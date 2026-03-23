# /design-from-image

Phân tích hình ảnh tham khảo + context để lên ý tưởng và sinh ra giao diện hoàn chỉnh.

**Input**: $ARGUMENTS (hình ảnh + mô tả context / yêu cầu)

## Quy trình

### Phase 1 — Phân tích & Ý tưởng

1. **Đọc hình ảnh** — phân tích chi tiết:
   - Layout structure (grid, flex, sections)
   - Color palette đang dùng
   - Typography hierarchy (headings, body, captions)
   - UI patterns (cards, tables, modals, sidebars, tabs)
   - Icons & visual elements
   - Spacing & whitespace rhythm

2. **Map vào context Wokki** — kết hợp design reference với:
   - Brand gradient: `#402093 → #5e34b7 → #8f58e4`
   - Tailwind CSS v4 + shadcn/ui components có sẵn
   - Dark mode support (`dark:` variants)
   - Vietnamese UI text
   - Existing project patterns (Dialog, Table, Card, Tabs...)

3. **Đề xuất ý tưởng** — trình bày trước khi code:
   - Layout sketch (mô tả sections, responsive behavior)
   - Component breakdown (shadcn nào dùng được, cái nào tự build)
   - Interaction plan (hover, click, transitions, loading states)
   - Điểm khác biệt so với hình gốc (adapt cho Wokki brand)
   - Hỏi confirm trước khi sinh code

### Phase 2 — Sinh giao diện

4. **Tạo code hoàn chỉnh**:
   - Component TSX với đầy đủ Tailwind styling
   - Responsive: mobile-first → `sm:` → `md:` → `lg:`
   - Dark mode: mọi custom color có `dark:` variant
   - Motion v12 animations: entrance, hover, transitions
   - shadcn components: `Button`, `Card`, `Dialog`, `Table`, `Badge`, `Separator`...
   - Icons: `lucide-react` (match visual style từ hình)
   - `cn()` cho conditional classes

5. **Mock data** — tạo sample data tiếng Việt để giao diện hiển thị thực tế:
   - Nếu component cần API → tạo kèm interface types
   - Data mẫu realistic (tên Việt, ngày giờ, trạng thái...)
   - Comment rõ chỗ nào cần thay bằng API call thật

## Rules

- **Hỏi confirm** ý tưởng trước khi sinh code (Phase 1 → confirm → Phase 2)
- Giữ code production-ready — không placeholder, không lorem ipsum
- Tuân thủ file structure dự án: `app/(features)/features/components/[feature]/`
- Nếu hình quá phức tạp → tách thành multiple components, mỗi file ≤200 dòng
- Không copy y chang — lấy inspiration từ hình, adapt cho Wokki brand

## Output

### Phase 1 output:
```
🎨 Design Analysis
[Phân tích layout, colors, patterns từ hình]

💡 Ý tưởng áp dụng cho Wokki
[Layout plan, component breakdown, interactions]

❓ Confirm để tiếp tục sinh code?
```

### Phase 2 output:
Full TSX component(s) với mock data, sẵn sàng render.
