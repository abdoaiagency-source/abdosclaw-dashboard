# Known Issues

## 1. Some old sessions may still need override hydration
Older OpenClaw sessions may be missing persisted `providerOverride` / `modelOverride` values even when they already have `model` and `modelProvider` recorded.

### Current handling
The backend bridge now self-heals this case for send actions by persisting session overrides before calling `openclaw agent --session-id ...`.

### What now works
- session listing
- session history reading
- backend bridge startup
- frontend dashboard rendering
- send actions for sessions that have `model` and `modelProvider` but were missing overrides

### Remaining edge case
Very old sessions with missing session file or incomplete metadata may still require manual cleanup or a fresh session.

## 2. Forge and Hangar remain mostly presentation-first
The current implementation work focused on the highest-value path:
- real sessions
- real history
- real chat surface

Forge/Hangar still need their own backend data sources in later phases.
