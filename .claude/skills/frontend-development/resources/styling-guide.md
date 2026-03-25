# Styling Guide

Tailwind CSS v4 + shadcn/ui (new-york) + design system tokens. All styling via Tailwind utility classes.

---

## Design System

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Deep | `#402093` | Dark backgrounds, headers |
| Mid | `#5e34b7` | Buttons, interactive elements |
| Accent / Primary | `#8f58e4` | Highlights, active states |

### Brand Gradient

```tsx
<div className="bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4]">
  Gradient Background
</div>
```

Always used for:
- Dialog/modal headers
- Feature card gradients
- Primary action areas

---

## Dark Mode

**Always add `dark:` variants. Never force a color mode.**

```tsx
{/* ✅ CORRECT — supports both modes */}
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">

{/* ❌ WRONG — forces light mode */}
<div className="bg-white text-gray-900">
```

shadcn/ui components handle dark mode automatically via CSS variables. For custom colors, always pair with `dark:`.

---

## `cn()` for Conditional Classes

Import `cn` from `@/lib/utils` for merging/conditional Tailwind classes.

```tsx
import { cn } from "@/lib/utils";

// Conditional classes
<div className={cn(
  "rounded-lg p-4 border",
  isActive && "border-[#8f58e4] bg-purple-50 dark:bg-purple-950",
  isDisabled && "opacity-50 cursor-not-allowed",
  className  // Always accept and merge external className prop
)}>

// Variant mapping
const variants = {
  default: "bg-white dark:bg-gray-800",
  primary: "bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] text-white",
  ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
};

<div className={cn("rounded-lg p-4", variants[variant])}>
```

---

## UI Component Priority

**Always prefer `@/components/ui/*` over raw HTML.**

| Raw HTML | Use instead |
|----------|-------------|
| `<button>` | `<Button>` — variants: `brand`, `brand-outline`, `outline`, `ghost`, `destructive` |
| `<input>` | `<Input>` |
| `<select>` + `<option>` | `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` |
| `<label>` | `<Label>` |
| `<table>` / `<thead>` / `<tr>` / `<td>` | `<Table>` / `<TableHeader>` / `<TableRow>` / `<TableCell>` |
| `<hr>` | `<Separator>` |
| `<img>` | `<SafeImage>` |
| loading placeholder | `<Skeleton>` |
| status pill / tag | `<Badge>` — variants: `default`, `secondary`, `outline`, `destructive` |
| card wrapper div | `<Card>` + `<CardHeader>` + `<CardContent>` + `<CardFooter>` |
| modal/popup | `<Dialog>` + `<DialogContent>` + `<DialogTitle>` |
| chart/graph | `<chart.tsx>` (wraps Recharts) |

Only use raw HTML for semantic wrappers with no interactive behavior: `<section>`, `<article>`, layout divs.

---

## Dialog / Modal Pattern

Standard dialog structure for this project:

```tsx
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MyDialog({ open, onClose }: MyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* p-0 overflow-hidden gap-0 are required */}
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-lg">

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] p-6 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl font-semibold">
              Dialog Title
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/80 text-sm mt-1">Subtitle or description</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
          {/* Content */}
        </div>

        {/* Footer with border-t */}
        <div className="border-t p-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="brand">Confirm</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
```

---

## Button Variants

```tsx
import { Button } from "@/components/ui/button";

<Button variant="brand">Primary Action</Button>          {/* Purple solid */}
<Button variant="brand-outline">Secondary Action</Button> {/* Purple outline */}
<Button variant="outline">Neutral</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Delete</Button>
```

---

## Badge Variants

```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

{/* Custom status badge */}
<Badge className={cn(
  status === "active" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  status === "inactive" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
)}>
  {status}
</Badge>
```

---

## Common Layout Patterns

### Page Layout

```tsx
<div className="space-y-6 p-6">
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Title</h1>
    <Button variant="brand">Add New</Button>
  </div>
  {/* Content */}
</div>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <h3 className="font-semibold">{item.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Stats Bar

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <Card key={stat.label} className="p-4">
      <p className="text-sm text-muted-foreground">{stat.label}</p>
      <p className="text-2xl font-bold text-[#8f58e4]">{stat.value}</p>
    </Card>
  ))}
</div>
```

---

## Animation with Motion v12

For component-level transitions and micro-interactions, use `motion/react`.

```tsx
import { motion, AnimatePresence } from "motion/react";

// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>

// Hover/tap effects on interactive elements
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Card>...</Card>
</motion.div>

// List item enter/exit
<AnimatePresence>
  {items.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <Item item={item} />
    </motion.div>
  ))}
</AnimatePresence>
```

**GSAP v3** (`gsap`): Use for complex multi-step sequences and scroll-triggered animations.

---

## Icons

```tsx
// Lucide React (preferred)
import { Search, Plus, Edit2, Trash2, ChevronRight } from "lucide-react";

// Tabler Icons (also available)
import { IconBell, IconCalendar } from "@tabler/icons-react";

// Standard icon sizes
<Search className="h-4 w-4" />     // Small (inline)
<Search className="h-5 w-5" />     // Default (buttons)
<Search className="h-6 w-6" />     // Large (headers)
```

---

## Summary

**Styling Checklist:**
- ✅ Use Tailwind utility classes
- ✅ Use shadcn/ui components instead of raw HTML
- ✅ Always add `dark:` variants for custom colors
- ✅ Brand gradient: `from-[#402093] via-[#5e34b7] to-[#8f58e4]`
- ✅ `cn()` for conditional/merged classes
- ✅ Dialog pattern: gradient header + scrollable body + `border-t` footer
- ✅ Brand accent: `#8f58e4`
- ❌ Never force a color mode (no hardcoded light-only colors)

**See Also:**
- [component-patterns.md](component-patterns.md) — Component structure
- [common-patterns.md](common-patterns.md) — Dialog and form patterns
