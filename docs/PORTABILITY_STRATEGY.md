# Portability Strategy

## Purpose
Define how this project avoids a "blank page" rebuild when moving to a new VPS.

## Strategy
### Keep in GitHub
- app code
- docs
- workflows
- deploy scripts
- PM2 config
- nginx templates
- env templates

### Keep in secure secret stores
- SSH private key
- dashboard API token
- Vercel env vars
- GitHub Actions secrets

### Keep in migration bundles
- current `.env` snapshot (secure handling required)
- PM2 process export
- nginx config snapshots
- current commit hash
- restore notes

## Future hardening direction
If later you want near one-click migration, the next layer should be:
- dockerized backend image
- private image registry
- volume backup strategy
- automated restore workflow

That would make migration even closer to plug-and-play, but the current repo is now prepared for a strong script-and-restore migration path.
