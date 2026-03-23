# /responsive

Kiểm tra và fix layout responsive cho component/page.

**Target**: $ARGUMENTS

## Quy trình

1. **Audit breakpoints** — kiểm tra render ở từng breakpoint:
   | Breakpoint | Width | Mục tiêu |
   |------------|-------|-----------|
   | Default    | <640px | Mobile portrait |
   | `sm:`      | 640px | Mobile landscape |
   | `md:`      | 768px | Tablet |
   | `lg:`      | 1024px | Desktop |
   | `xl:`      | 1280px | Wide desktop |

2. **Checklist issues phổ biến**:
   - [ ] Horizontal overflow / scroll ngang không mong muốn
   - [ ] Text bị cắt mà không có `truncate` hoặc `line-clamp-*`
   - [ ] Grid/flex không collapse đúng trên mobile (`grid-cols-1` fallback)
   - [ ] Touch targets < 44px (buttons, links, interactive elements)
   - [ ] Dialog/modal quá rộng trên mobile (nên `max-w-[95vw]` hoặc `w-full`)
   - [ ] Table không scroll được ngang trên mobile (cần `overflow-x-auto`)
   - [ ] Font size quá nhỏ trên mobile (≥14px body text)
   - [ ] Spacing quá lớn trên mobile (giảm padding/margin cho `sm:`)
   - [ ] Fixed/absolute elements che content trên mobile

3. **Fix strategy**:
   - Mobile-first: base styles cho mobile, scale up với `sm:` `md:` `lg:`
   - Dùng `max-w-*` thay vì fixed width
   - Stack layouts dọc trên mobile: `flex-col` → `md:flex-row`
   - Hide secondary content trên mobile: `hidden md:block`

## Không làm

- Thay đổi logic hoặc data flow
- Thêm feature mới

## Output

Danh sách issues tìm được + full rewritten code đã fix responsive.
