# /generate-hook

Extract logic lặp lại từ component(s) thành custom hook tái sử dụng.

**Target**: $ARGUMENTS

## Quy trình

1. **Phân tích** — đọc component(s) được cung cấp, tìm:
   - State + effect logic lặp lại giữa 2+ components
   - Logic phức tạp nên tách ra khỏi component (>15 dòng state/effect)
   - Data fetching + transformation patterns
   - Form handling / validation logic
   - Event handler chains

2. **Design hook**:
   - Tên: `use[Feature]` — mô tả rõ purpose (ví dụ: `useEmployeeFilter`, `useShiftForm`)
   - Interface: xác định input params và return values
   - Giữ hook focused — một responsibility duy nhất
   - Return object (không array) để dễ destructure có chọn lọc:
     ```typescript
     return { data, isLoading, error, handlers }
     ```

3. **Tạo file**:
   - Path: `hooks/use[FeatureName].ts`
   - Có đầy đủ TypeScript types cho params và return
   - JSDoc comment mô tả purpose và usage

4. **Refactor components** — thay thế inline logic bằng hook call

## Rules

- Giữ nguyên behavior — chỉ extract, không sửa logic
- Nếu hook cần context/provider → báo rõ và tạo kèm
- Nếu logic chỉ dùng ở 1 component và <15 dòng → khuyên không nên extract

## Output

1. **Hook file** hoàn chỉnh với types + JSDoc
2. **Refactored component(s)** sử dụng hook mới
3. **Usage example** ngắn gọn
