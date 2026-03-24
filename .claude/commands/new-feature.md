# /new-feature

Scaffold a new feature following project conventions.

**Usage**: `/new-feature [feature-name]`

## Task

1. **Identify** — understand the feature's purpose, required API calls, and UI needs
2. **Create components** in `app/(features)/features/components/[feature-name]/`:
   ```
   [FeatureName]Page.tsx      # Main container ("use client")
   [FeatureName]List.tsx      # Table/list view
   [FeatureName]Detail.tsx    # Detail/modal view
   [FeatureName]Form.tsx      # Create/edit form (useState + manual validation)
   ```
3. **API service** — create `lib/api/services/fetch[FeatureName].ts`:
   - Import axios singleton: `import apiService from '@/lib/api/core'`
   - Export typed async functions + Request/Response interfaces
   - Pattern: `apiService.get<T>('/api/v1/...')` → return `response.data`
4. **Query hook** — create `hooks/use[FeatureName].ts`:
   - `useQuery<T, ApiError>` với `enabled` guard
   - `useMutation<Res, ApiError, Req>` với `mutationKey`, `onSuccess` invalidate, `onError` toast
5. **Constants** — thêm key vào `QUERY_KEYS` object trong `lib/constants/index.ts`
6. **Types** — thêm interfaces vào `types/models.ts` hoặc `types/api.ts`
7. **Register tab** — thêm entry trong `app/(features)/features/layout.tsx` với `?tab=[feature-name]`

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
    <div className="bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] px-5 pt-5 pb-4">
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

- Feature components: `"use client"` (đây là app client-side nặng về hooks/events)
- Hooks: `use[Name].ts` — không đặt tên `fetch` trong hooks, chỉ trong services
- Import: `import type { Foo }` cho type-only; alias `@/` cho tất cả internal
- Import order: external → `@/lib` → `@/hooks` → `@/components/ui` → `@/types`
- Toast: `import { toast } from 'sonner'` — message tiếng Việt
- Icons: `lucide-react` preferred; `@tabler/icons-react` khi cần icon đặc biệt hơn
- Dark mode: luôn thêm `dark:` variant — không hardcode light-only color
- Gradient: `bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4]`
- Animations: `motion/react` cho transitions/micro-interactions; GSAP cho sequences phức tạp
- `cn()` từ `@/lib/utils` cho conditional classes

## UI component map — không dùng raw HTML khi đã có component

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

Raw HTML chỉ dùng cho layout semantics (`<section>`, `<article>`, `<main>`, flex/grid wrapper `<div>`).
