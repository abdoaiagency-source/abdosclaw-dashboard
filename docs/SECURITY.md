# Security Notes

## Current hardening
The dashboard bridge now follows these rules:

### Read endpoints
- `/api/status`
- `/api/sessions`
- `/api/sessions/:sessionKey/history`

If `DASHBOARD_API_TOKEN` is configured, these endpoints require a bearer token.
If no token is configured, read access is limited to loopback/local requests only.

### Write endpoint
- `/api/sessions/:sessionKey/send`

This endpoint is disabled by default.
It only works when both are true:
- `DASHBOARD_API_TOKEN` is configured
- `DASHBOARD_ENABLE_WRITE=true`

## Recommended production settings
```bash
CORS_ORIGIN=https://your-vercel-domain.vercel.app
DASHBOARD_API_TOKEN=long-random-secret
DASHBOARD_ENABLE_WRITE=true
```

## Deployment rules
- never expose the backend bridge publicly without token auth
- never set `CORS_ORIGIN=*` in production
- keep the backend bridge on the VPS or private server side
- keep Vercel for frontend only unless you fully trust the serverless flow and env handling

## Threat model
This bridge can read session history and send messages into live OpenClaw sessions.
Treat it as an operator tool, not a public widget.
