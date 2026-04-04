# Migration Checklist

## Before migrating
- [ ] GitHub repo is current
- [ ] `docs/STATUS_HANDOFF.md` is current
- [ ] backend `.env` values are known and backed up securely
- [ ] Vercel env vars are recorded securely
- [ ] GitHub Actions secrets are recorded securely
- [ ] DNS targets are known
- [ ] SSH method for new VPS is confirmed

## Export from current VPS
- [ ] export app bundle
- [ ] export env template or secure env copy
- [ ] export PM2 process info
- [ ] export nginx config if present
- [ ] record health endpoint result
- [ ] record current commit hash

## Prepare new VPS
- [ ] install Node.js
- [ ] install npm
- [ ] install pm2
- [ ] install nginx
- [ ] install certbot
- [ ] configure SSH access

## Restore on new VPS
- [ ] clone repo
- [ ] restore `.env`
- [ ] run `npm ci`
- [ ] run `npm run build`
- [ ] start PM2 via ecosystem config
- [ ] verify `curl http://127.0.0.1:8787/api/health`
- [ ] configure nginx reverse proxy
- [ ] issue SSL cert
- [ ] verify `https://api.abdrhmane.com/api/health`

## Reconnect control plane
- [ ] update GitHub Actions secrets if host/IP changed
- [ ] verify auto-deploy
- [ ] confirm Vercel envs
- [ ] verify frontend to backend connectivity

## Final validation
- [ ] sessions list loads
- [ ] session history loads
- [ ] backend auth works
- [ ] CORS works
- [ ] write remains disabled until explicitly approved
