# /enhance-ui

Improve the visual quality and UX of an existing UI component or section.

## Usage
```
/enhance-ui [paste code or file path]
```

## What I will do
1. **Visual polish** — spacing, typography scale, border radius, shadow depth
2. **Brand consistency** — replace off-brand colors with `#8f58e4` / `#402093` / `#5e34b7` tokens
3. **Dark mode** — fill in missing `dark:` variants, ensure proper contrast in both modes
4. **Micro-interactions** — add hover, focus, active states using Tailwind transitions
5. **Responsive** — fix layout breaks at mobile (`sm:`), tablet (`md:`), desktop (`lg:`)
6. **Motion** — add subtle entrance/exit animations via Motion v12 where appropriate
7. **Accessibility** — fix missing `aria-*`, ensure focus rings, keyboard nav

## What I will NOT do
- Change component logic or data flow
- Add new features
- Swap libraries

## Output
Full rewritten JSX/TSX of the component — drop-in replacement, same props interface.

## Example
```
/enhance-ui [paste ShiftDetailDialog code]
```
