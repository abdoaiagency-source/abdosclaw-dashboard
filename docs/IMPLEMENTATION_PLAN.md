# Implementation Plan

## Phase 0 — done now
- review current frontend base
- identify mocked areas
- document architecture and deployment plan

## Phase 1 — backend bridge scaffold
- create `server/` folder
- expose `/api/sessions`
- expose `/api/sessions/:key/history`
- expose `/api/sessions/:key/send`
- expose `/api/status`

## Phase 2 — real session UI
- replace mocked Command panel with session list + thread
- wire selected session state
- wire message send flow
- add loading and error states

## Phase 3 — operational polish
- add refresh controls
- add recent activity panel
- add session metadata strip
- improve empty/loading states

## Phase 4 — project/forge integration
- connect Hangar to real project metadata
- connect Forge to real queue/job backend when ready

## Phase 5 — GitHub + deployment
- create GitHub repo
- push code
- connect Vercel
- deploy frontend
- configure backend bridge env + domain

## Current recommendation
Do not try to wire Forge/Hangar first.
Get **real multi-session chat** working first.
That is the highest-value path for this UI.
