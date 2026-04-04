# Status Handoff

_Last updated: 2026-04-04_

## Active Context
The active project context is **AbdosClaw Dashboard deployment and integration**.

### Current focus
- frontend is already on GitHub and intended for Vercel
- backend bridge is already deployed locally on the VPS and managed by PM2
- the current blocker is **GitHub Actions backend auto-deploy SSH authentication**
- public API exposure via `api.abdrhmane.com` is not finished yet
- `write/send` remains intentionally disabled until public API + auth + end-to-end checks are complete
- migration readiness has now been documented and scaffolded inside the repo

### Current blocker
The remaining blocker is:
- `VPS_SSH_KEY` does not match the actual SSH private key accepted by the VPS host for `root@187.77.100.95`

### Resume-from-here steps
1. fix `VPS_SSH_KEY`
2. rerun GitHub backend auto-deploy
3. install/configure `nginx` + `certbot` on VPS host
4. connect `api.abdrhmane.com` → `127.0.0.1:8787`
5. issue SSL certificate
6. set Vercel env vars
7. test frontend → backend end-to-end
8. only then consider enabling `DASHBOARD_ENABLE_WRITE=true`

## Repo
- GitHub: `abdoaiagency-source/abdosclaw-dashboard`
- Frontend deployment target: Vercel (manual Git integration already chosen by owner)
- Backend deployment target: VPS host behind `api.abdrhmane.com`

## What has been completed

### Product / code
- React + Vite frontend reviewed and promoted from mock base into a real operations dashboard direction.
- `Command Center` now uses a real backend bridge for:
  - session list
  - session history
  - sending messages to selected sessions
- Backend bridge added under `server/`.
- Security hardening added:
  - token-based auth support
  - local-only read fallback when no token is configured
  - write/send disabled by default unless explicitly enabled
  - CORS allowlist support
- Legacy session send failures were reduced by adding session override hydration before send.

### Documentation
The repo now includes:
- architecture docs
- API contract
- deployment plan
- security notes
- backend deploy checklist
- known issues
- implementation plan

### Deployment preparation
- `vercel.json` added for frontend deployment
- GitHub Actions CI added
- GitHub Actions backend auto-deploy workflow added
- PM2 ecosystem file added
- backend deploy script added

## Current live state

### Backend bridge on VPS
A working backend instance was deployed manually on the VPS in:
- `/data/.openclaw/apps/abdosclaw-dashboard`

It is managed by PM2 as:
- `abdosclaw-dashboard-bridge`

The service was confirmed online locally via:
- `pm2 status`
- `curl http://127.0.0.1:8787/api/health`

### Runtime posture
- `DASHBOARD_ENABLE_WRITE=false`
- write/send is intentionally disabled in production config for now
- backend auth is configured
- CORS was prepared for `https://dashboard.abdrhmane.com`

## Domain / DNS status
- DNS `A` record was added for:
  - `api.abdrhmane.com` → `187.77.100.95`

## What is blocked right now

### Backend GitHub auto-deploy is not fully working yet
GitHub Actions successfully runs and reaches the SSH step, but deployment fails with:
- `Permission denied (publickey,password)`

This means:
- the workflow is correct
- the GitHub secrets mostly exist
- the remaining blocker is the SSH identity used by GitHub Actions

### Confirmed blocker
The remaining problem is the SSH private key used in `VPS_SSH_KEY`.
It does not match the actual SSH access accepted by the VPS host for the selected SSH user.

### SSH user
- Confirmed SSH user for host access: `root`
- `VPS_USER` secret was updated to `root`

### Remaining SSH task
Provide the **correct root SSH private key** in GitHub Secret:
- `VPS_SSH_KEY`

Not a public key.
Not a key created only inside the OpenClaw runtime/container.
The actual private key that can log in to:
- `root@187.77.100.95`

## What still needs to be done

### 1. Fix GitHub Actions SSH auth
- Replace `VPS_SSH_KEY` with the correct root private key
- Re-run the backend deploy workflow
- Confirm GitHub Actions can SSH into the VPS and execute `scripts/deploy-backend.sh`

### 2. Finish public API exposure
The backend is running locally, but public API setup is not finished.
Still needed on the VPS host:
- install `nginx`
- install `certbot`
- configure reverse proxy:
  - `api.abdrhmane.com` → `127.0.0.1:8787`
- issue SSL certificate
- verify:
  - `https://api.abdrhmane.com/api/health`

### 3. Finish frontend env in Vercel
Set in Vercel:
- `VITE_API_BASE_URL=https://api.abdrhmane.com`
- `VITE_DASHBOARD_API_TOKEN=<backend token>`

### 4. Only after API is live and verified
Consider enabling live send/write:
- set `DASHBOARD_ENABLE_WRITE=true`
- verify send path from dashboard carefully

## Recommended next-step order
1. Fix `VPS_SSH_KEY`
2. Verify GitHub auto-deploy works
3. Install nginx + certbot on VPS host
4. Configure `api.abdrhmane.com` reverse proxy + SSL
5. Set Vercel env vars
6. Test frontend → backend end-to-end
7. Leave write disabled until read path is confirmed stable
8. Only then enable write/send if desired

## Important security note
No secrets should be committed into the repo.
This document intentionally does **not** include:
- dashboard API token value
- private SSH key contents
- GitHub personal access token

## Operational notes
- PM2 process name: `abdosclaw-dashboard-bridge`
- Local backend port: `8787`
- Current deployment app dir on VPS: `/data/.openclaw/apps/abdosclaw-dashboard`
- Current GitHub Actions deploy script path in repo: `scripts/deploy-backend.sh`
