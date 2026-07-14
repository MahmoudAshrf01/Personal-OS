# Flow Todo - Personal OS

An offline-first personal productivity workspace. Manage tasks, goals, notes, and focus sessions in one app - with gamification, analytics, and a backend-ready architecture.

Built with React 19, Dexie, and Motion.

---

## Overview

Flow Todo is a **Personal Operating System** for daily productivity. Data lives in the browser via IndexedDB, so the app works without a network. A layered architecture (features → engines → repositories) keeps the codebase ready for a future API or sync layer.

| Principle | Implementation |
|-----------|----------------|
| Offline first | Dexie (IndexedDB) for all persistent data |
| Modular UI | Feature-based routes with React Router |
| Clean separation | Engines for business logic, repositories for data access |
| Polished UX | Motion animations, AMOLED dark mode, keyboard shortcuts |

---

## Features

### Productivity

- **Tasks** - Kanban board with drag-and-drop (Planned -> In Progress -> Done)
- **Goals** - Long-term objectives with progress tracking
- **Calendar** - Due-date overview for scheduled tasks
- **Notes** - Quick capture (TipTap-ready content field)
- **Journal** - Dated entries with mood tracking
- **Pomodoro** - 25-minute focus timer with session logging

### Insights and motivation

- **Dashboard** - At-a-glance stats, XP progress, quick navigation
- **Analytics** - Completion rates, weekly activity, 7-day bar chart
- **Gamification** - XP, levels, coins, streaks, and categorized achievements (tasks, focus, consistency, milestones) with progress bars

### Task capabilities

- Priority badges (low / medium / high)
- Due dates, tags, and notes
- Search and status filters
- Live stats (overdue, high-priority open, completion counts)
- Dark mode with AMOLED-friendly true-black background

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | React 19, TypeScript, Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4, shadcn/ui (Base UI) |
| Drag and drop | Kibo UI list board, @dnd-kit |
| Animation | [Motion](https://motion.dev/) (`motion/react`) |
| State | Zustand (UI state only) |
| Database | Dexie (IndexedDB) |
| Rich text | TipTap (installed, ready to wire) |
| Dates | date-fns, Day.js |
| Linting | Oxlint |

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Features (UI + routes)                 │
│  tasks · goals · notes · analytics …    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Zustand (ephemeral UI state)           │
│  filters · sidebar · theme              │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Engines (business logic)               │
│  Task · Game · Analytics · Snapshot …   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Repositories (data access)             │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Dexie / IndexedDB                      │
└─────────────────────────────────────────┘
```

Repositories implement a consistent CRUD interface so IndexedDB can be swapped for REST or GraphQL later without changing UI code.

---

## Project structure

```
src/
├── app/                 # Router, layout, providers
├── components/          # Shared UI (shadcn, Kibo UI, theme)
├── domain/              # Pure TypeScript types and enums
├── database/            # Dexie schema, bootstrap, migrations
├── repositories/        # IndexedDB data access layer
├── engines/             # Business logic orchestration
├── features/            # Feature modules (one folder per domain)
│   ├── tasks/
│   ├── goals/
│   ├── calendar/
│   ├── notes/
│   ├── journal/
│   ├── pomodoro/
│   ├── analytics/
│   ├── gamification/
│   └── dashboard/
├── store/               # Zustand stores
├── hooks/               # Shared React hooks
└── lib/                 # Utilities
```

Full design docs live in [`Personal-OS-Starter-Kit/`](./Personal-OS-Starter-Kit/).

---

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
git clone <repository-url>
cd flow-todo
npm install
npm run dev
```

Open the URL printed in the terminal (default: `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

---

## Routes

| Path | Module |
|------|--------|
| `/` | Dashboard |
| `/tasks` | Task board |
| `/goals` | Goals |
| `/calendar` | Calendar |
| `/notes` | Notes |
| `/journal` | Journal |
| `/pomodoro` | Pomodoro timer |
| `/analytics` | Analytics |
| `/gamification` | XP, levels, achievements |

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus task search |
| `G` then `T` | Go to Tasks |
| `G` then `A` | Go to Analytics |
| `G` then `D` | Go to Dashboard |

Shortcuts are disabled while typing in inputs and text areas.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

---

## Data and persistence

- All app data is stored in **IndexedDB** via Dexie (`personal-os` database).
- On first launch, the app seeds sample tasks and achievement definitions.
- Legacy data from the previous localStorage format is migrated automatically on bootstrap.

To reset local data, clear site storage in your browser dev tools (Application → IndexedDB → delete `personal-os`).

---

## Documentation

The [`Personal-OS-Starter-Kit/`](./Personal-OS-Starter-Kit/) folder contains the full product spec:

- Product vision and requirements
- Tech stack and coding standards
- Database design and domain models
- Gamification and analytics rules
- UI/UX guidelines (Motion, AMOLED theme, accessibility)
- Development roadmap and build prompts

Start with [Personal-OS-Starter-Kit/README.md](./Personal-OS-Starter-Kit/README.md).

---

## Roadmap

- [ ] TipTap rich-text editor for Notes and Journal
- [ ] Nested group UI for tasks and goals
- [ ] Snapshot export and restore UI
- [ ] Weekly review creation flow
- [ ] Cloud sync and collaboration

See [19-Future-Features.md](./Personal-OS-Starter-Kit/docs/19-Future-Features.md) for the full list.

---

## Contributing

1. Follow the conventions in [13-Coding-Standards.md](./Personal-OS-Starter-Kit/docs/13-Coding-Standards.md).
2. Keep features self-contained under `src/features/`.
3. Do not call Dexie directly from UI - use repositories or engines.
4. Use `useMemo` for derived Zustand state; avoid returning new objects or arrays from store selectors.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for component primitives
- [Kibo UI](https://kibo-ui.com/) for the drag-and-drop list pattern
- [Motion](https://motion.dev/) for animations
- [Dexie.js](https://dexie.org/) for IndexedDB
