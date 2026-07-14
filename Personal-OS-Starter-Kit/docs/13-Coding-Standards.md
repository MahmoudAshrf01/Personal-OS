# Coding Standards

- **TypeScript strict** — no `any`; use domain types from `src/domain/`
- **SOLID / DRY** — repositories for data, engines for logic, features for UI
- **Feature-first** — new modules go under `src/features/<name>/`
- **Reusable components** — shared UI in `src/components/`
- **Motion** — use `motion/react` for animations; keep durations 150–300 ms
- **Imports** — use `@/` path alias
- **Naming** — PascalCase components, camelCase functions, kebab-case files
