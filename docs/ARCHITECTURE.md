# Architecture

## Recommended architecture

```text
React/Vite frontend
        ↓
Backend bridge / API layer
        ↓
OpenClaw runtime + workspace + sessions
```

## Why this architecture
The frontend should never hold:
- provider secrets
- raw auth profiles
- direct privileged control over OpenClaw state

The backend bridge should own:
- session listing
- session history reads
- message sending
- subagent spawning
- guarded operational actions

## Frontend responsibilities
- render multi-session UI
- hold selected session state
- display messages, metadata, and statuses
- call backend endpoints
- poll or subscribe for updates

## Backend responsibilities
- call OpenClaw-compatible routes or wrappers
- normalize data into dashboard-friendly JSON
- enforce safe allowed actions
- hide implementation details from the browser

## OpenClaw responsibilities
- store sessions
- route messages
- manage auth/provider model usage
- maintain subagents and session history
- remain the runtime source of truth

## Suggested code split
### Frontend
- `src/layout/`
- `src/features/sessions/`
- `src/features/chat/`
- `src/features/projects/`
- `src/features/forge/`
- `src/lib/api/`
- `src/store/`

### Backend
- `server/index.js`
- `server/routes/sessions.js`
- `server/routes/subagents.js`
- `server/routes/status.js`
- `server/services/openclaw.js`
- `server/config.js`

## Suggested runtime model
### Session list panel
Displays available sessions and their summaries.

### Session thread panel
Shows the message history for the selected session.

### Composer panel
Sends messages into the selected session.

### Status strip
Shows selected session metadata, model, last activity, and maybe health.

## Security notes
- Do not read or expose `auth-profiles.json` to the browser
- Do not send provider tokens to the frontend
- Keep backend actions bounded and explicit
- Prefer allowlisted operational actions over arbitrary command execution
