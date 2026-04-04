# AbdosClaw Dashboard

Mission-control dashboard for OpenClaw.

## Current state
This project is currently a **frontend prototype** built with React + Vite.
It already has a strong visual shell and 3 panel concepts:
- **Command Center** — intended for live agent status, chat, sessions, logs, costs, and quick actions
- **The Forge** — intended for generation queue / media pipeline operations
- **The Hangar** — intended for project portfolio / links / infrastructure overview

Right now the app is mostly **mocked UI**:
- simulated agent status
- simulated activity logs
- static queue data
- static project cards
- no backend bridge yet
- no real OpenClaw session integration yet

## Goal
Turn this into a real dashboard that can:
- list OpenClaw sessions
- open conversation history
- send messages into selected sessions
- monitor subagents and task runs
- expose higher-level controls safely through a backend bridge

## Recommended architecture
Do **not** connect the React frontend directly to OpenClaw secrets/auth.

Use this structure instead:
- **Frontend (React/Vite)**
- **Backend bridge (Node/Express or similar)**
- **OpenClaw runtime / Gateway**

Frontend → Backend bridge → OpenClaw

## Planned milestones
1. Replace mocked Command Center data with real session data
2. Add backend API bridge for sessions/history/send/spawn
3. Add live multi-session chat UI
4. Add project/service status cards backed by real data
5. Add deployment pipeline (GitHub + Vercel frontend)
6. Add secure workspace/OpenClaw linking config

## Docs
See `docs/` for the full project package:
- `PROJECT_OVERVIEW.md`
- `ARCHITECTURE.md`
- `API_CONTRACT.md`
- `SESSION_UI_MODEL.md`
- `WORKSPACE_LINK_PLAN.md`
- `DEPLOYMENT_PLAN.md`
- `GITHUB_PUBLISHING_CHECKLIST.md`
- `KNOWN_ISSUES.md`
- `SECURITY.md`
- `STATUS_HANDOFF.md` (includes the current active context and resume-from-here steps)
- `MIGRATION_PLAN.md`
- `MIGRATION_CHECKLIST.md`
- `MIGRATION_STATE_MAP.md`
- `RECOVERY_RUNBOOK.md`
- `PORTABILITY_STRATEGY.md`

## Local development
Install once:
```bash
npm install
```

Run backend bridge:
```bash
npm run dev:server
```

Run frontend:
```bash
npm run dev
```

The frontend expects the backend bridge on `http://localhost:8787` during development.
For protected environments, set `DASHBOARD_API_TOKEN` on the backend and `VITE_DASHBOARD_API_TOKEN` on the frontend.
Write/send actions are disabled by default until `DASHBOARD_ENABLE_WRITE=true` is set on the backend.

## Build
```bash
npm run build
npm run preview
```

## Publishing status
- Project reviewed and documented inside workspace
- Backend bridge scaffold added
- Real session list + history integration added to Command Center
- Session send route added and hardened for older session metadata
- GitHub Actions CI added
- GitHub Actions backend auto-deploy workflow added
- Vercel frontend config added
- Auto-deploy pipeline test commit applied
- Auto-deploy retry after SSH user correction
- Migration pack added (plan, checklist, state map, recovery runbook, export/restore scripts)
