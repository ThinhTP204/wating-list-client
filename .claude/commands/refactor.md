# /refactor

Refactor code để clean hơn, tuân thủ conventions dự án, giữ nguyên behavior.

**Target**: $ARGUMENTS

## Quy trình

1. **Phân tích** — đọc code, xác định code smells và vi phạm conventions
2. **Component splitting** — tách component >200 dòng thành các sub-components focused
3. **Extract hooks** — logic reusable (≥2 lần) → custom hook trong `hooks/use[Name].ts`
4. **Extract services** — API calls trực tiếp trong component → `lib/api/services/[feature].ts`
5. **Type safety** — bổ sung/chỉnh sửa TypeScript types trong `types/`, loại bỏ `any`
6. **React patterns** — áp dụng React 19 / Next.js 16 idioms:
   - `use()` hook cho promises khi phù hợp
   - Server Components mặc định, `"use client"` chỉ khi cần hooks/events
   - Proper `key` props, tránh index-as-key khi list mutable
7. **Import cleanup** — dùng `@/` alias, sắp xếp imports (externals → internals → types)
8. **Naming** — camelCase cho functions/variables, PascalCase cho components/types

## Rules

- **Giữ nguyên** file structure trừ khi được yêu cầu di chuyển
- **Giữ nguyên** external API/props interface
- **Không** thêm abstraction layer không cần thiết
- **Không** swap libraries hoặc thêm dependencies
- **Không** thay đổi behavior — nếu phát hiện bug, báo rõ nhưng không tự sửa

## Output

1. **Summary** — liệt kê ngắn các thay đổi chính (dạng bullet)
2. **Full code** — file(s) đã refactor hoàn chỉnh, sẵn sàng thay thế
