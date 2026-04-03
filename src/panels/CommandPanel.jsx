import { useEffect, useMemo, useState } from 'react'
import { getSessions, getSessionHistory, getStatus, sendSessionMessage } from '../lib/api'

function formatRelativeTime(value) {
  if (!value) return 'Unknown'
  const ts = Number(value)
  const date = Number.isFinite(ts) ? new Date(ts) : new Date(value)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function SessionList({ sessions, selectedSessionKey, onSelect, loading }) {
  return (
    <div className="card animate-in" style={{ height: '100%' }}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-header-icon">🧵</span>
          <div>
            <h3>Sessions</h3>
            <span className="card-header-sub">{loading ? 'Loading…' : `${sessions.length} available`}</span>
          </div>
        </div>
      </div>
      <div className="card-body no-pad" style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
        {sessions.map((session) => (
          <button
            key={session.key}
            className={`action-btn ${selectedSessionKey === session.key ? 'selected' : ''}`}
            style={{
              width: '100%',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              borderRadius: 0,
              alignItems: 'flex-start',
              padding: '14px 16px',
              background: selectedSessionKey === session.key ? 'var(--accent-dim)' : 'transparent',
            }}
            onClick={() => onSelect(session.key)}
          >
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{session.title}</strong>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatRelativeTime(session.lastActivity)}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{session.key}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>{session.model}</span>
                <span>{session.kind}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageThread({ session, history, loading }) {
  return (
    <div className="card animate-in" style={{ height: '100%' }}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-header-icon">💬</span>
          <div>
            <h3>{session?.title || 'Conversation'}</h3>
            <span className="card-header-sub">
              {loading ? 'Loading messages…' : `${history.length} messages`}
            </span>
          </div>
        </div>
      </div>
      <div className="card-body no-pad" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 260px)' }}>
        <div className="log-container" style={{ flex: 1, maxHeight: 'none', borderRadius: 0 }}>
          {history.map((message) => (
            <div key={message.id || `${message.timestamp}-${message.role}`} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', gap: '12px' }}>
                <span className={`log-type ${message.role === 'assistant' ? 'success' : message.role === 'tool' ? 'warn' : 'info'}`}>
                  {message.role.toUpperCase()}
                </span>
                <span className="log-time">{message.timestamp ? new Date(message.timestamp).toLocaleString() : ''}</span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                {message.text}
              </div>
            </div>
          ))}
          {!loading && history.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No messages available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommandPanel({ agentStatus }) {
  const [sessions, setSessions] = useState([])
  const [selectedSessionKey, setSelectedSessionKey] = useState(null)
  const [history, setHistory] = useState([])
  const [status, setStatus] = useState(null)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [error, setError] = useState('')

  const selectedSession = useMemo(
    () => sessions.find((item) => item.key === selectedSessionKey) || null,
    [sessions, selectedSessionKey]
  )

  async function loadSessions() {
    setLoadingSessions(true)
    setError('')
    try {
      const [sessionItems, statusSummary] = await Promise.all([getSessions(), getStatus()])
      setSessions(sessionItems)
      setStatus(statusSummary)
      if (!selectedSessionKey && sessionItems[0]?.key) {
        setSelectedSessionKey(sessionItems[0].key)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSessions(false)
    }
  }

  async function loadHistory(sessionKey) {
    if (!sessionKey) return
    setLoadingHistory(true)
    setError('')
    try {
      const result = await getSessionHistory(sessionKey, 120)
      setHistory(result.messages || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadSessions()
    const interval = setInterval(loadSessions, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSessionKey) {
      loadHistory(selectedSessionKey)
    }
  }, [selectedSessionKey])

  async function handleSend(event) {
    event.preventDefault()
    if (!selectedSessionKey || !chatInput.trim()) return
    setSending(true)
    setError('')
    try {
      await sendSessionMessage(selectedSessionKey, chatInput.trim())
      setChatInput('')
      await loadHistory(selectedSessionKey)
      await loadSessions()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="grid-4 section-gap">
        <div className="stat-card animate-in">
          <div className="stat-icon">🤖</div>
          <div className="stat-value" style={{ color: agentStatus === 'online' ? 'var(--green)' : agentStatus === 'busy' ? 'var(--yellow)' : 'var(--red)' }}>
            {agentStatus.charAt(0).toUpperCase() + agentStatus.slice(1)}
          </div>
          <div className="stat-label">Agent Status</div>
        </div>
        <div className="stat-card animate-in">
          <div className="stat-icon">🧵</div>
          <div className="stat-value">{status?.sessionCount ?? sessions.length}</div>
          <div className="stat-label">Tracked Sessions</div>
        </div>
        <div className="stat-card animate-in">
          <div className="stat-icon">📨</div>
          <div className="stat-value">{history.length}</div>
          <div className="stat-label">Loaded Messages</div>
        </div>
        <div className="stat-card animate-in">
          <div className="stat-icon">🧠</div>
          <div className="stat-value" style={{ fontSize: '14px' }}>{selectedSession?.model || '—'}</div>
          <div className="stat-label">Selected Model</div>
        </div>
      </div>

      {error && (
        <div className="card section-gap" style={{ borderColor: 'var(--red)' }}>
          <div className="card-body" style={{ color: 'var(--red)' }}>{error}</div>
        </div>
      )}

      <div className="grid-2 section-gap" style={{ gridTemplateColumns: '360px 1fr' }}>
        <SessionList
          sessions={sessions}
          selectedSessionKey={selectedSessionKey}
          onSelect={setSelectedSessionKey}
          loading={loadingSessions}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MessageThread session={selectedSession} history={history} loading={loadingHistory} />
          <div className="card animate-in">
            <div className="card-body">
              <form className="chat-input-box" style={{ padding: 0, borderTop: 'none' }} onSubmit={handleSend}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder={selectedSession ? `Send message to ${selectedSession.title}...` : 'Select a session first'}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!selectedSession || sending}
                />
                <button type="submit" className="chat-send-btn" disabled={!selectedSession || sending}>
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
