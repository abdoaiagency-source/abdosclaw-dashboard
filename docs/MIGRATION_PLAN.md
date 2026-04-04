# Migration Plan

## Goal
Make AbdosClaw Dashboard portable so it can be moved to a new VPS without starting from a blank page.

## Migration philosophy
A successful migration needs **four layers**:

1. **Code layer**
   - GitHub repo
   - workflows
   - scripts
   - frontend source
   - backend bridge source

2. **Runtime layer**
   - Node version
   - npm packages
   - PM2 process definition
   - build artifacts reproducible from source

3. **Configuration + secrets layer**
   - `.env` values
   - Vercel env vars
   - GitHub Actions secrets
   - DNS / domains
   - CORS rules

4. **State / infrastructure layer**
   - current app directory
   - PM2 process name
   - nginx config
   - SSL state
   - OpenClaw paths
   - session/runtime dependencies

## What this repo now includes for migration readiness
- deployment docs
- PM2 ecosystem config
- deploy script
- backend bridge code
- frontend build config
- security hardening docs
- status handoff docs
- migration scripts and templates

## What still lives outside the repo
These must be restored separately and must NOT be committed:
- backend `.env`
- GitHub Actions secrets
- Vercel env vars
- SSH private key for backend auto-deploy
- nginx live config
- SSL certificates
- any host-specific auth/state outside the app directory

## Migration target modes
### Mode A — Fast host replacement
Use the repo + migration bundle + env restore to stand up the same app on a new VPS.

### Mode B — Recovery after VPS loss
Use the repo + backup bundle + secrets re-entry to recover the service.

### Mode C — Parallel staging VPS
Bring up a second host with the same app before cutting traffic over.

## Recommended migration order
1. Prepare new VPS
2. Install Node, npm, pm2, nginx, certbot
3. Clone repo
4. Restore `.env`
5. Restore nginx config
6. Build app
7. Start PM2 process
8. Verify local health endpoint
9. Point DNS / update reverse proxy
10. Reconnect Vercel frontend and GitHub Actions secrets if needed

## Migration-ready definition
This project is considered migration-ready when:
- repo contains full deployment docs
- env template exists
- PM2 ecosystem exists
- backup/export script exists
- restore script exists
- nginx template exists
- state map exists
- handoff/status doc is current

This repo now satisfies that definition at the planning/scaffolding level.
