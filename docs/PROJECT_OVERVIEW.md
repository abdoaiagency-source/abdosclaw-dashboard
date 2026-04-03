# Project Overview

## Name
AbdosClaw Dashboard

## Purpose
A control surface for OpenClaw operations, chat sessions, creative generation workflows, and project visibility.

## What exists today
The project already includes:
- a polished cockpit-style React UI
- sidebar navigation
- topbar / status shell
- three conceptual panels:
  - Command Center
  - The Forge
  - The Hangar

## What is still missing
The current version is presentation-first. It does **not yet** include:
- real OpenClaw session data
- real message history
- real chat send flow
- real subagent job tracking
- real queue/job backend
- secure backend bridge
- deployment config for production hosting

## Product direction
This dashboard should become the main operations UI for:
- viewing active chats and sessions
- messaging across multiple sessions
- launching advisor/subagent tasks
- tracking project queues and outputs
- exposing a curated status surface for OpenClaw and related services

## Primary user
Abdo / operator mode.

## Core product promises
1. One place to supervise OpenClaw activity
2. Multi-session chat from a clean UI
3. Safe operational bridge to the workspace/runtime
4. Clear separation between frontend display and backend authority

## Current UI-to-product mapping
### Command Center
Should evolve into:
- sessions list
- selected chat thread
- message composer
- live status cards
- logs / cost / model info

### The Forge
Should evolve into:
- generation queue
- render job status
- prompt workspace
- creative pipeline controls

### The Hangar
Should evolve into:
- projects registry
- repo links
- deployment links
- runtime/service status
- project switching

## Recommended immediate scope
For v1, focus only on:
- session list
- session history
- send message
- recent activity
- selected session details

Everything else can remain mocked until the chat/session layer is real.
