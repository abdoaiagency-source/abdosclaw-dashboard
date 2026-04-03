# Workspace Link Plan

## Goal
Link this dashboard safely to the existing OpenClaw workspace and runtime.

## Principle
The dashboard should be a **control surface**, not a second runtime.

## Link target
This dashboard will point to the existing OpenClaw environment already running in this workspace.

## Integration strategy
### Phase 1 — Read-only visibility
- list sessions
- read session history
- show status
- show current model/session info

### Phase 2 — Controlled write actions
- send messages
- spawn subagents
- refresh state

### Phase 3 — Extended operations
- run curated quick actions
- surface workspace project info
- integrate forge queue / portfolio data

## Backend bridge requirements
- must run near the workspace/OpenClaw runtime
- must have access to session APIs or wrappers
- must not expose raw auth or filesystem internals to the browser

## Environment variables to plan for
```bash
OPENCLAW_API_BASE=
OPENCLAW_API_TOKEN=
DASHBOARD_ALLOWED_ACTIONS=sessions,history,send,spawn,status
```

## Suggested deployment split
### Option A — same VPS
- frontend built and served from same environment
- backend bridge deployed on same host
- simplest integration path

### Option B — Vercel frontend + VPS backend
- Vercel hosts the UI
- VPS hosts bridge/API
- frontend talks to bridge over HTTPS
- better deployment UX, but requires careful CORS/token setup

## Recommended path
Start with:
- **VPS-hosted backend bridge**
- optionally **Vercel-hosted frontend**

This keeps secrets and workspace access on your infrastructure.
