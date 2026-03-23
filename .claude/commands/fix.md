# /fix

Debug và sửa bug/error — phân tích trước, sửa sau.

**Bug / Error**: $ARGUMENTS

## Quy trình

1. **Thu thập context**:
   - Đọc error message / stack trace
   - Xác định file(s) liên quan
   - Kiểm tra data flow: Component → Hook → Service → API

2. **Phân tích root cause**:
   - Tracing: theo dõi data từ source đến chỗ lỗi
   - Kiểm tra types: TypeScript có bắt được không? Có `any` nào che lỗi?
   - Kiểm tra state: React Query cache, Redux state, useState timing
   - Kiểm tra async: race conditions, missing await, stale closures

3. **Sửa lỗi**:
   - Fix nhỏ nhất có thể — không refactor kèm
   - Giữ nguyên code style hiện tại
   - Thêm null checks / error boundaries nếu cần

4. **Verify** — chạy sau khi sửa:
   ```bash
   npm run type-check    # TypeScript errors
   npm run lint          # ESLint violations
   ```

## Output

```
🔍 Root Cause
[Giải thích ngắn gọn nguyên nhân]

🔧 Fix
[Mô tả thay đổi]

📝 Code Changes
[Code diff / full file]

🛡️ Prevention
[Gợi ý cách tránh lỗi tương tự trong tương lai]
```
