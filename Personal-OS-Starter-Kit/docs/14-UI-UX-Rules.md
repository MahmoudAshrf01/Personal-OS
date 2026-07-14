# UI/UX Rules

## Theme

- **Light mode** — soft neutral background with indigo accent.
- **Dark mode (AMOLED)** — true black `#000000` background for OLED screens; elevated surfaces at `oklch(0.12 …)`.
- Respect `prefers-color-scheme`; persist choice in localStorage.

## Motion (animation library)

Use the **Motion** library (`import { motion } from 'motion/react'`):

| Pattern | Usage |
|---------|-------|
| Page enter | `initial={{ opacity: 0, y: 8 }}` → `animate={{ opacity: 1, y: 0 }}` |
| List items | Stagger children with `transition={{ delay: index * 0.05 }}` |
| Layout shifts | `layout` prop on reorderable cards |
| Modals | Scale + fade: `initial={{ opacity: 0, scale: 0.95 }}` |
| Duration | 150–300 ms; ease `[0.25, 0.1, 0.25, 1]` |

Avoid animating expensive properties (width, height) — prefer `transform` and `opacity`.

## Responsive

- Mobile-first; sidebar collapses to bottom nav below `md`.
- Touch-friendly hit targets (min 44 px).

## Accessibility

- Semantic HTML, ARIA labels on icon-only buttons.
- Focus rings visible (`outline-ring/50`).
- Keyboard shortcuts documented in settings.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New task |
| `/` | Focus search |
| `G then T` | Go to tasks |
| `G then A` | Go to analytics |
| `?` | Show shortcuts |
