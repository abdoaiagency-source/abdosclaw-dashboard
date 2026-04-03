# Session UI Model

## Required state in frontend
```js
const [sessions, setSessions] = useState([])
const [selectedSessionKey, setSelectedSessionKey] = useState(null)
const [messages, setMessages] = useState([])
const [loadingSessions, setLoadingSessions] = useState(false)
const [loadingMessages, setLoadingMessages] = useState(false)
const [sending, setSending] = useState(false)
```

## Core UI layout
### Left rail
- session search
- session list
- badges for type / activity / unread / subagent

### Main thread area
- selected session title
- message timeline
- timestamps
- optional tool badges / metadata

### Composer area
- message input
- send button
- optional quick actions

## Session card fields
- title
- kind
- last message preview
- last activity time
- active/inactive indicator

## Thread message fields
- role
- text
- timestamp
- optional source metadata

## V1 user flow
1. Dashboard loads sessions
2. User selects a session
3. Dashboard fetches history
4. User sends message
5. Dashboard refreshes the session history

## Nice-to-have later
- streaming responses
- inline subagent status
- per-session model indicator
- favorite/pinned sessions
- filters by channel / kind / active time
