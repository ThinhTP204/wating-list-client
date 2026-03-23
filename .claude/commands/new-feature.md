# /new-feature

Scaffold một feature mới theo đúng structure và conventions của dự án.

**Feature name**: $ARGUMENTS

## Quy trình

1. **Xác nhận scope** — hỏi lại nếu thiếu thông tin:
   - Tên feature (English, kebab-case)
   - Mô tả ngắn chức năng
   - API endpoints cần gọi (nếu có)
   - Các fields/data cần hiển thị

2. **Tạo file structure**:
   ```
   app/(features)/features/components/[feature-name]/
   ├── index.tsx                    # Main component (export default)
   ├── components/
   │   └── [SubComponent].tsx       # Sub-components nếu cần
   lib/api/services/
   └── [feature-name].service.ts    # API service functions
   hooks/
   └── use[FeatureName].ts          # TanStack Query hooks
   types/
   └── [feature-name].types.ts      # TypeScript interfaces
   ```

3. **Conventions tự động áp dụng**:
   - Component: `"use client"` chỉ khi cần hooks/events
   - API service: dùng Axios singleton từ `lib/api/core.ts`
   - Query hooks: `useQuery` / `useMutation` với queryKey từ `lib/constants/`
   - Types: interface cho request, response, và component props
   - UI: shadcn components, `cn()`, `dark:` variants, text tiếng Việt
   - Icons: `lucide-react`

4. **Kết nối vào tab navigation** (nếu cần):
   - Thêm tab entry trong `app/(features)/features/page.tsx`
   - Thêm route trong layout tab config

## Output

Tất cả file cần tạo, mỗi file có comment header mô tả purpose. Sẵn sàng để bắt đầu implement logic.
