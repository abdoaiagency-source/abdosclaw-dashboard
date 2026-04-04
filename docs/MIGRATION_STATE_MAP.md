# Migration State Map

## Canonical repo
- GitHub repo: `abdoaiagency-source/abdosclaw-dashboard`

## Current VPS deployment
- app dir: `/data/.openclaw/apps/abdosclaw-dashboard`
- backend service name: `abdosclaw-dashboard-bridge`
- backend port: `8787`
- process manager: `pm2`

## Runtime dependencies
- Node.js 22+ recommended
- npm required
- pm2 required
- nginx planned for public reverse proxy
- certbot planned for SSL issuance

## Frontend deployment
- Vercel project expected
- frontend domain target: `dashboard.abdrhmane.com`

## Backend public target
- API domain target: `api.abdrhmane.com`
- backend local upstream: `127.0.0.1:8787`

## Required env classes
### Backend env
- `PORT`
- `OPENCLAW_BIN`
- `OPENCLAW_AGENT_ID`
- `OPENCLAW_STATE_DIR`
- `OPENCLAW_WORKDIR`
- `CORS_ORIGIN`
- `DASHBOARD_API_TOKEN`
- `DASHBOARD_ENABLE_WRITE`

### Frontend env (Vercel)
- `VITE_API_BASE_URL`
- `VITE_DASHBOARD_API_TOKEN`

### GitHub Actions secrets
- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `APP_DIR`

## Host-level items outside repo
- root SSH private key used by GitHub Actions
- nginx live config under `/etc/nginx/`
- SSL certs from certbot
- any host firewall / access rules

## OpenClaw coupling
The backend bridge assumes access to:
- `/data/.openclaw`
- `/data/.openclaw/workspace`
- OpenClaw CLI in PATH as `openclaw`

If a new VPS uses different paths, update `.env` accordingly.
