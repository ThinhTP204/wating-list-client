# /add-api

Tạo nhanh full API integration layer cho một endpoint.

**Endpoint / mô tả**: $ARGUMENTS

## Quy trình

1. **Xác nhận thông tin** — hỏi lại nếu thiếu:
   - HTTP method (GET / POST / PUT / PATCH / DELETE)
   - Endpoint path (ví dụ: `/api/employees`)
   - Request body / query params (nếu có)
   - Response structure mong đợi

2. **Tạo 3 files**:

   ### `types/[feature].types.ts`
   ```typescript
   // Request & Response interfaces
   export interface [Name]Request { ... }
   export interface [Name]Response { ... }
   ```

   ### `lib/api/services/[feature].service.ts`
   ```typescript
   // Sử dụng Axios singleton từ lib/api/core.ts
   import { get, post, put, patch, del } from '@/lib/api/core';
   ```

   ### `hooks/use[FeatureName].ts`
   ```typescript
   // TanStack Query hook
   // GET → useQuery với queryKey từ lib/constants/
   // POST/PUT/DELETE → useMutation với onSuccess invalidation
   ```

3. **Conventions**:
   - Error handling: Axios interceptor đã xử lý 401, chỉ cần handle business errors
   - Loading/error states: return từ hook, component tự render
   - Optimistic updates: dùng `onMutate` + `onError` rollback khi cần
   - Cache invalidation: `queryClient.invalidateQueries()` trong `onSuccess`

## Output

3 files hoàn chỉnh, sẵn sàng import vào component. Kèm ví dụ usage ngắn gọn.
