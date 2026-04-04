# Recovery Runbook

## Scenario
You have a new VPS and want to restore AbdosClaw Dashboard without starting from zero.

## Fast recovery order
1. Provision VPS
2. Install Node.js, npm, pm2, nginx, certbot
3. Clone GitHub repo
4. Restore `.env`
5. Build app
6. Start PM2
7. Verify local health endpoint
8. Configure nginx reverse proxy
9. Issue SSL certificate
10. Reconnect Vercel frontend
11. Verify end-to-end

## Minimal commands
```bash
git clone https://github.com/abdoaiagency-source/abdosclaw-dashboard.git /data/.openclaw/apps/abdosclaw-dashboard
cd /data/.openclaw/apps/abdosclaw-dashboard
npm ci
npm run build
cp deploy/backend.env.production.example .env
# edit .env with real values
ABDOSCLAW_APP_DIR=/data/.openclaw/apps/abdosclaw-dashboard pm2 start ecosystem.config.cjs
pm2 save
curl http://127.0.0.1:8787/api/health
```

## After service is healthy
- apply nginx config template
- run certbot
- verify `https://api.abdrhmane.com/api/health`
- set Vercel env vars
- verify dashboard UI

## Important note
Do not enable `DASHBOARD_ENABLE_WRITE=true` until read path, auth, and CORS are confirmed stable.
