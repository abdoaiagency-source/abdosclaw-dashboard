# Known Issues

## 1. Legacy session model references can block send actions
Some older OpenClaw sessions in this environment still carry legacy model references such as:
- `openai-codex:default`
- fallback names that no longer resolve cleanly

### Symptom
`POST /api/sessions/:sessionKey/send` may fail for those older sessions with a model-switch or unknown-model error.

### What still works
- session listing
- session history reading
- backend bridge startup
- frontend dashboard rendering

### Recommended fix
Clean the stale model config and legacy fallback warnings in the main OpenClaw environment so live-session sends reuse valid model references.

## 2. Forge and Hangar remain mostly presentation-first
The current implementation work focused on the highest-value path:
- real sessions
- real history
- real chat surface

Forge/Hangar still need their own backend data sources in later phases.
