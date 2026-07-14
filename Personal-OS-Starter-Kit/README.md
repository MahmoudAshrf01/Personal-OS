# Personal OS — Starter Kit

Documentation and build prompts for a **Personal Operating System**: productivity, goals, notes, analytics, and gamification — offline-first with a backend-ready architecture.

## Docs (read in order)

| # | Document | Description |
|---|----------|-------------|
| 01 | [Product Vision](docs/01-Product-Vision.md) | What we're building and why |
| 02 | [Requirements](docs/02-Requirements.md) | Functional & non-functional requirements |
| 03 | [Tech Stack](docs/03-Tech-Stack.md) | React, Motion, Dexie, Zustand, etc. |
| 04 | [System Architecture](docs/04-System-Architecture.md) | Engines, layers, module boundaries |
| 05 | [Database Design](docs/05-Database-Design.md) | IndexedDB schema via Dexie |
| 06 | [Domain Models](docs/06-Domain-Models.md) | Core entity definitions |
| 07 | [Features](docs/07-Features.md) | Feature modules |
| 08 | [Gamification](docs/08-Gamification.md) | XP, levels, coins, rewards |
| 09 | [Analytics](docs/09-Analytics.md) | Metrics & dashboards |
| 10 | [State Management](docs/10-State-Management.md) | Zustand + repositories |
| 11 | [Folder Structure](docs/11-Folder-Structure.md) | Project layout |
| 12 | [Development Roadmap](docs/12-Development-Roadmap.md) | Build phases |
| 13 | [Coding Standards](docs/13-Coding-Standards.md) | TypeScript, SOLID, conventions |
| 14 | [UI/UX Rules](docs/14-UI-UX-Rules.md) | AMOLED theme, a11y, Motion |
| 15 | [Sequence Diagrams](docs/15-Sequence-Diagrams.md) | Key flows |
| 16 | [Data Flow](docs/16-Data-Flow.md) | UI → repo → engine → dashboard |
| 17 | [API Preparation](docs/17-API-Preparation.md) | Repository abstraction |
| 18 | [Testing Strategy](docs/18-Testing-Strategy.md) | Unit, integration, E2E |
| 19 | [Future Features](docs/19-Future-Features.md) | AI, sync, collaboration |

## Build Prompts

| Prompt | Purpose |
|--------|---------|
| [Build-Project](prompts/Build-Project.md) | Scaffold & follow all docs |
| [Build-Database](prompts/Build-Database.md) | Dexie schema + repositories |
| [Build-Tasks](prompts/Build-Tasks.md) | Tasks module |
| [Build-Gamification](prompts/Build-Gamification.md) | XP, levels, coins |
| [Build-Analytics](prompts/Build-Analytics.md) | Dashboards & metrics |

## Quick Start

```bash
npm install
npm run dev
```
