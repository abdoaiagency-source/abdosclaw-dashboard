# Deployment Plan

## Goal
Deploy the dashboard safely and make it ready for iterative improvement.

## Auto-deploy model
### Frontend
Use **Vercel Git integration** so every push to `main` auto-deploys the frontend.

### Backend bridge
Use **GitHub Actions** to SSH into the VPS and run the backend deploy script on every push to `main`.

## Recommended deployment model
### Frontend
Deploy to **Vercel** for fast preview builds and easy iterations.

### Backend bridge
Deploy on the **existing VPS/OpenClaw host** or another controlled server.

## Why split them
- Vercel is excellent for static/frontend deployment
- backend bridge needs trusted access to OpenClaw/runtime state
- secrets should stay off the frontend host

## Vercel plan
1. Push repo to GitHub
2. Import project into Vercel
3. Set frontend env vars:
   - `VITE_API_BASE_URL`
   - `VITE_DASHBOARD_API_TOKEN`
4. Deploy previews on every push
5. Promote production after API bridge is live

## Backend bridge env
- `CORS_ORIGIN` should be set to the exact frontend domain(s)
- `DASHBOARD_API_TOKEN` should be set before any public exposure
- `DASHBOARD_ENABLE_WRITE=true` only when you are ready to allow live sends

## Backend bridge plan
1. Create `server/` app
2. Add routes from `API_CONTRACT.md`
3. Add authentication to dashboard requests
4. Restrict CORS to your frontend domain
5. Deploy on VPS
6. Add health endpoint
7. Add `pm2` process management
8. Add GitHub Action workflow to pull and restart on push

## GitHub Actions backend secrets
Configure these repository secrets:
- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `APP_DIR`

## Pre-deploy checklist
- README updated
- docs committed
- repo created
- frontend builds successfully
- bridge scaffolding present
- environment variables documented

## Post-deploy checklist
- session list loads
- selected session history loads
- send message works
- no secrets are exposed client-side
- CORS is correctly restricted

## Handoff note
See `docs/STATUS_HANDOFF.md` for the latest known deployment state, blockers, and next steps.
