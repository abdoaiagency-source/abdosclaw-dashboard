# API Contract (Dashboard ↔ Backend Bridge)

## Goal
Define the minimum backend API needed to make the dashboard real.

## 1. List sessions
### Request
`GET /api/sessions`

### Response
```json
[
  {
    "key": "agent:main:telegram:...",
    "title": "Telegram / Abdo",
    "kind": "direct",
    "model": "openai-codex/gpt-5.4",
    "lastMessage": "...",
    "lastActivity": "2026-04-04T00:00:00Z"
  }
]
```

## 2. Session history
### Request
`GET /api/sessions/:sessionKey/history?limit=100`

### Response
```json
{
  "sessionKey": "agent:main:telegram:...",
  "messages": [
    {
      "role": "user",
      "text": "Hello",
      "timestamp": "2026-04-04T00:00:00Z"
    },
    {
      "role": "assistant",
      "text": "Hi",
      "timestamp": "2026-04-04T00:00:02Z"
    }
  ]
}
```

## 3. Send message to session
### Request
`POST /api/sessions/:sessionKey/send`

### Body
```json
{
  "message": "Run this task"
}
```

### Response
```json
{
  "ok": true,
  "queued": true
}
```

## 4. Spawn subagent
### Request
`POST /api/subagents/spawn`

### Body
```json
{
  "label": "market-review",
  "task": "Analyze this product idea"
}
```

### Response
```json
{
  "ok": true,
  "sessionKey": "agent:main:subagent:..."
}
```

## 5. Status summary
### Request
`GET /api/status`

### Response
```json
{
  "gateway": "ok",
  "agent": "main",
  "model": "openai-codex/gpt-5.4",
  "sessionCount": 12
}
```

## Notes
- Session keys should be treated as opaque IDs
- The backend may normalize or redact tool-heavy history before sending it to UI
- WebSocket or SSE can be added later for live updates, but polling is enough for v1
