# /new-feature

Scaffold a new feature following the FSD architecture. (Khởi tạo cấu trúc cơ bản cho một feature mới theo kiến trúc FSD.)

**Usage**: `/new-feature [feature-name]`

## Task

1. **Identify** — understand the feature's purpose, required API calls, and UI needs
2. **Create feature directory** `features/[feature-name]/`:
   ```
   features/[feature-name]/
   ├── hooks/
   │   └── use[FeatureName].ts    # React Query hooks
   ├── services/
   │   └── [featureName]Api.ts    # API service functions
   └── types/                     # (optional) feature-specific types
   ```
3. **Service** — create `features/[feature-name]/services/[featureName]Api.ts`:
   - Import: `import apiService from '@/shared/lib/api/client'`
   - Export typed async functions + Request/Response interfaces
   - Pattern: `apiService.request<T>({ method, url, ... })` → return `response.data`
4. **Query hook** — create `features/[feature-name]/hooks/use[FeatureName].ts`:
   - `useQuery<T, ApiError>` with `enabled` guard
   - `useMutation<Res, ApiError, Req>` with `onSuccess` invalidate + `toast.success` + `onError` toast
5. **Constants** — add key to `QUERY_KEYS` in `lib/constants/index.ts`
6. **Types** — if shared across features → `shared/types/[domain].ts`; feature-only → `features/[name]/types/`
7. **UI** — feature components live in `app/(admin)/admin/components/[feature]/` or `app/(employee)/employee/components/[feature]/`

## Service template

```typescript
// features/[feature-name]/services/[featureName]Api.ts
import apiService from "@/shared/lib/api/client";
import type { ApiError } from "@/shared/lib/api/client";
import type { FeatureItem } from "@/shared/types/[domain]";

export interface FetchFeatureParams {
  apiKey: string;
  page?: number;
  limit?: number;
}

export async function fetchFeatureItems({
  apiKey,
  page = 1,
  limit = 10,
}: FetchFeatureParams): Promise<FeatureItem[]> {
  const response = await apiService.request<{ data: FeatureItem[] }>({
    method: "GET",
    url: "/api/v1/[resource]",
    params: { page, limit },
    headers: { "x-api-key": apiKey },
  });
  return response.data.data;
}

export async function deleteFeatureItem({
  id,
  apiKey,
}: { id: string; apiKey: string }): Promise<void> {
  await apiService.request({
    method: "DELETE",
    url: `/api/v1/[resource]/${id}`,
    headers: { "x-api-key": apiKey },
  });
}
```

## Hook template

```typescript
// features/[feature-name]/hooks/use[FeatureName].ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import {
  fetchFeatureItems,
  deleteFeatureItem,
  type FetchFeatureParams,
} from "@/features/[feature-name]/services/[featureName]Api";
import type { FeatureItem } from "@/shared/types/[domain]";

export function useFeatureItems({ apiKey, page, limit, enabled = true }: FetchFeatureParams & { enabled?: boolean }) {
  return useQuery<FeatureItem[], ApiError>({
    queryKey: [QUERY_KEYS.FEATURE, page, limit, apiKey],
    queryFn: () => fetchFeatureItems({ apiKey, page, limit }),
    enabled: enabled && !!apiKey,
  });
}

export function useDeleteFeatureItem(apiKey: string) {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (id) => deleteFeatureItem({ id, apiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEATURE] });
      toast.success("Xóa thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Thao tác thất bại, vui lòng thử lại.");
    },
  });
}
```

## Form pattern (no react-hook-form)

```tsx
const [formData, setFormData] = useState<CreateRequest>(initialState)
const [errors, setErrors] = useState<Record<string, string>>({})

const handleChange = (field: keyof CreateRequest, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }))
  if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
}

const validate = (): boolean => {
  const newErrors: Record<string, string> = {}
  if (!formData.name.trim()) newErrors.name = 'Tên không được để trống'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!validate()) return
  mutate(formData)
}
```

## Dialog pattern

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
    <DialogTitle className="sr-only">[Title]</DialogTitle>
    {/* Gradient header */}
    <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-5 pt-5 pb-4">
      ...
    </div>
    {/* Scrollable body */}
    <div className="px-4 py-3 space-y-3">
      ...
    </div>
    {/* Footer */}
    <div className="px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
      <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
      <Button variant="brand" type="submit">Lưu</Button>
    </div>
  </DialogContent>
</Dialog>
```

## Conventions

- Components: `"use client"` only when using hooks or event handlers
- Import order: external → `@/lib` → `@/shared` → `@/features` → `@/components`
- Toast: Vietnamese messages — `toast.success("Thành công")` / `toast.error("Thất bại...")`
- Icons: `lucide-react` preferred; `@tabler/icons-react` for specialty icons
- Dark mode: always `dark:` variants
- Gradient: `bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]`
- `cn()` from `@/lib/utils` for conditional classes

## UI component map

| Raw HTML | Component (`@/components/ui/*`) |
|----------|----------------------------------|
| `<button>` | `<Button variant="brand\|brand-outline\|outline\|ghost\|destructive">` |
| `<input>` | `<Input>` |
| `<select>` | `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` |
| `<label>` | `<Label>` |
| `<table>` / `<tr>` / `<td>` | `<Table>` / `<TableHeader>` / `<TableRow>` / `<TableCell>` |
| `<hr>` | `<Separator>` |
| `<img>` | `<SafeImage>` |
| loading div | `<Skeleton>` |
| status tag | `<Badge variant="default\|secondary\|outline\|destructive">` |
| card wrapper | `<Card>` + `<CardHeader>` + `<CardContent>` + `<CardFooter>` |
| modal | `<Dialog>` + `<DialogContent>` + `<DialogTitle className="sr-only">` |
| chart | `@/components/ui/chart` (wraps Recharts) |
