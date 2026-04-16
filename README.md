# Foresight 360

**Event-Driven Forecasting Platform** — a wireframe demo built for Gilead Sciences by Chryselys.

🔗 **Live demo:** https://urvil86.github.io/foresight360/

## Stack

- Next.js 16 (App Router, static export)
- React 19, TypeScript
- Tailwind CSS v4
- Recharts (charts), Lucide (icons)

## Local development

```bash
nvm use 20
npm install
npx next dev
```

Then open http://localhost:3000

## Production build (static export)

```bash
NODE_ENV=production npx next build
```

The static site is emitted to `out/` and deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Modules

| Route | Module | Status |
|-------|--------|--------|
| `/` | Login | Functional |
| `/dashboard` | Main Dashboard | Functional |
| `/event-modeler` | Event / Intervention Modeler | Functional |
| `/scenario-planner` | Scenario Planning & Comparison | Functional |
| `/sensitivity-engine` | Simulation & Sensitivity | Functional |
| `/ci-intelligence` | Competitive Intelligence | Functional |
| `/consolidator` | Forecast Consolidation | Functional |
| `/reports` | Automated Outputs | Functional |
| `/forecast-drivers` | Forecast Drivers / Audit | Functional |
| `/ai-assistant` | AI Assistant | Functional |
| `/analog-tool` | Analog Analysis (Phase 2B controlled scope) | Functional |

A floating **Ask AI** button is available on every page with context-aware suggested actions.
