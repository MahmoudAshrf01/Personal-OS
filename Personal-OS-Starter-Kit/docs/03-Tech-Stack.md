# Tech Stack

## Core

| Layer | Choice | Purpose |
|-------|--------|---------|
| Framework | **React 19** | UI rendering |
| Language | **TypeScript** (strict) | Type safety |
| Build | **Vite** | Dev server & production bundling |
| Routing | **React Router** | Client-side navigation |

## Styling & UI

| Layer | Choice | Purpose |
|-------|--------|---------|
| CSS | **Tailwind CSS v4** | Utility-first styling |
| Components | **shadcn/ui + Base UI** | Accessible primitives |
| Lists & DnD | **Kibo UI** | Drag-and-drop list boards |
| Icons | **Lucide React** | Icon set |
| Animation | **Motion** (`motion/react`) | Page transitions, micro-interactions, layout animations |

## State & Data

| Layer | Choice | Purpose |
|-------|--------|---------|
| UI State | **Zustand** | Ephemeral UI state (filters, modals, theme) |
| Persistence | **Dexie** (IndexedDB) | Offline-first local database |
| Pattern | **Repository** | Backend-ready data access abstraction |
| IDs | **nanoid** | Unique identifiers |

## Content & Dates

| Layer | Choice | Purpose |
|-------|--------|---------|
| Rich Text | **TipTap** | Notes & journal editing |
| Dates | **Day.js** | Date parsing, formatting, relative time |

## Drag & Drop

| Layer | Choice | Purpose |
|-------|--------|---------|
| DnD | **@dnd-kit** | Task reordering & cross-column moves |

## Tooling

| Layer | Choice | Purpose |
|-------|--------|---------|
| Lint | **Oxlint** | Fast linting |
| Class utils | **clsx**, **tailwind-merge**, **cva** | Conditional & merged classes |

## Motion Usage Guidelines

- Import from `motion/react` (not the legacy `framer-motion` package name).
- Use `motion.*` for enter/exit and layout animations.
- Prefer `layout` prop for list reorder feedback.
- Keep animations subtle (150–300 ms) for productivity UX.
