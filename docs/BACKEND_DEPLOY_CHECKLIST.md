# Backend Deploy Checklist

## VPS preparation
- install Node.js 22+
- install npm
- install pm2 globally
- create app directory: `/opt/abdosclaw-dashboard`
- clone the repo into that directory
- create production `.env` file

## Required production env
```bash
PORT=8787
OPENCLAW_BIN=openclaw
OPENCLAW_AGENT_ID=main
OPENCLAW_STATE_DIR=/data/.openclaw
OPENCLAW_WORKDIR=/data/.openclaw/workspace
CORS_ORIGIN=https://dashboard.abdrhmane.com
DASHBOARD_API_TOKEN=long-random-secret
DASHBOARD_ENABLE_WRITE=false
```

## PM2 first run
```bash
cd /opt/abdosclaw-dashboard
npm ci
npm run build
ABDOSCLAW_APP_DIR=/opt/abdosclaw-dashboard pm2 start ecosystem.config.cjs
pm2 save
```

## GitHub secrets to add
- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `APP_DIR` = `/opt/abdosclaw-dashboard`

## After first deployment
- check `pm2 status`
- check `curl http://127.0.0.1:8787/api/health`
- add nginx reverse proxy for `api.abdrhmane.com`
- enable SSL
- only then consider `DASHBOARD_ENABLE_WRITE=true`
