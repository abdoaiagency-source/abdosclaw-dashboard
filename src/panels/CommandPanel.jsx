import { useState, useEffect, useRef } from 'react'

const MOCK_LOGS = [
    { time: '22:14:02', type: 'info', msg: 'Agent initialized — model: gemini-2.5-pro' },
    { time: '22:14:05', type: 'success', msg: 'Connected to Telegram channel @AbdosClaw' },
    { time: '22:14:12', type: 'info', msg: 'Loading skills: web_search, code_gen, image_gen' },
    { time: '22:15:30', type: 'info', msg: 'Incoming message from user: "Check site status"' },
    { time: '22:15:31', type: 'info', msg: 'Planning: decomposing task into 2 steps' },
    { time: '22:15:33', type: 'success', msg: 'Step 1/2: HTTP GET effectwaveco.com → 200 OK' },
    { time: '22:15:35', type: 'success', msg: 'Step 2/2: Response sent to user via Telegram' },
    { time: '22:18:00', type: 'warn', msg: 'Token usage approaching daily limit (82%)' },
    { time: '22:20:45', type: 'info', msg: 'Incoming message: "Generate product shot for earbuds"' },
    { time: '22:20:47', type: 'info', msg: 'Routing to image_gen skill with prompt optimization' },
    { time: '22:21:15', type: 'success', msg: 'Image generated — 1024x1024 PNG, saved to /output/' },
    { time: '22:25:00', type: 'info', msg: 'Cron job triggered: daily_briefing' },
    { time: '22:25:08', type: 'success', msg: 'Briefing sent: weather, calendar, top news' },
    { time: '22:30:00', type: 'error', msg: 'OpenRouter API rate limit hit — retrying in 30s' },
    { time: '22:30:32', type: 'success', msg: 'Retry successful — connection restored' },
]

const COST_DATA = [
    { day: 'Mon', cost: 0.42 },
    { day: 'Tue', cost: 1.15 },
    { day: 'Wed', cost: 0.87 },
    { day: 'Thu', cost: 2.30 },
    { day: 'Fri', cost: 1.68 },
    { day: 'Sat', cost: 0.95 },
    { day: 'Sun', cost: 0.54 },
]

export default function CommandPanel({ agentStatus }) {
    const [logs, setLogs] = useState(MOCK_LOGS.slice(0, 8))
    const [chatInput, setChatInput] = useState('')
    const logRef = useRef(null)

    // Simulate live log entries
    useEffect(() => {
        let idx = 8
        const interval = setInterval(() => {
            if (idx < MOCK_LOGS.length) {
                setLogs(prev => [...prev, MOCK_LOGS[idx]])
                idx++
            } else {
                // Generate random heartbeat logs
                const now = new Date()
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 8)
                const randomLogs = [
                    { time: timeStr, type: 'info', msg: 'Heartbeat OK — latency 42ms' },
                    { time: timeStr, type: 'info', msg: 'Memory usage: 128MB / 512MB' },
                    { time: timeStr, type: 'success', msg: 'Health check passed — all systems nominal' },
                ]
                const pick = randomLogs[Math.floor(Math.random() * randomLogs.length)]
                setLogs(prev => [...prev.slice(-20), pick])
            }
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight
        }
    }, [logs])

    const maxCost = Math.max(...COST_DATA.map(d => d.cost))
    const totalWeek = COST_DATA.reduce((s, d) => s + d.cost, 0).toFixed(2)

    const handleChat = (e) => {
        e.preventDefault()
        if (!chatInput.trim()) return
        const now = new Date()
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 8)
        setLogs(prev => [...prev, {
            time: timeStr,
            type: 'info',
            msg: `User command: "${chatInput}"`
        }])
        setChatInput('')
        // Simulate response
        setTimeout(() => {
            const t = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8)
            setLogs(prev => [...prev, {
                time: t,
                type: 'success',
                msg: 'Agent acknowledged — processing your request...'
            }])
        }, 1500)
    }

    return (
        <div>
            {/* Stats Row */}
            <div className="grid-4 section-gap">
                <div className="stat-card animate-in">
                    <div className="stat-icon">🤖</div>
                    <div className="stat-value" style={{ color: agentStatus === 'online' ? 'var(--green)' : agentStatus === 'busy' ? 'var(--yellow)' : 'var(--red)' }}>
                        {agentStatus.charAt(0).toUpperCase() + agentStatus.slice(1)}
                    </div>
                    <div className="stat-label">Agent Status</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">147</div>
                    <div className="stat-label">Tasks Today</div>
                    <div className="stat-change up">↑ 23% vs yesterday</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">🪙</div>
                    <div className="stat-value">${totalWeek}</div>
                    <div className="stat-label">Weekly Cost</div>
                    <div className="stat-change down">↓ 12% vs last week</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-value">42ms</div>
                    <div className="stat-label">Avg Latency</div>
                    <div className="stat-change up">↑ Excellent</div>
                </div>
            </div>

            {/* Main row: Log + Actions */}
            <div className="grid-2 section-gap" style={{ gridTemplateColumns: '2fr 1fr' }}>
                {/* Activity Log */}
                <div className="card animate-in">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">📡</span>
                            <div>
                                <h3>Live Activity Feed</h3>
                                <span className="card-header-sub">{logs.length} entries</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body no-pad">
                        <div className="log-container" ref={logRef}>
                            {logs.map((log, i) => (
                                <div className="log-entry" key={i}>
                                    <span className="log-time">{log.time}</span>
                                    <span className={`log-type ${log.type}`}>
                                        {log.type.toUpperCase()}
                                    </span>
                                    <span className="log-msg">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                        <form className="chat-input-box" onSubmit={handleChat}>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Send a command to OpenClaw..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button type="submit" className="chat-send-btn">Send</button>
                        </form>
                    </div>
                </div>

                {/* Right column: Quick Actions + Cost */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Quick Actions */}
                    <div className="card animate-in">
                        <div className="card-header">
                            <div className="card-header-left">
                                <span className="card-header-icon">🎮</span>
                                <h3>Quick Actions</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="action-grid">
                                <button className="action-btn">
                                    <span className="action-icon">🔄</span>
                                    Restart Agent
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">🧹</span>
                                    Clear Memory
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">📋</span>
                                    Daily Brief
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">⏸️</span>
                                    Pause Agent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cost Chart */}
                    <div className="card animate-in">
                        <div className="card-header">
                            <div className="card-header-left">
                                <span className="card-header-icon">💰</span>
                                <div>
                                    <h3>API Spend</h3>
                                    <span className="card-header-sub">Last 7 days · ${totalWeek}</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="cost-chart">
                                {COST_DATA.map((d, i) => (
                                    <div
                                        key={i}
                                        className="cost-bar"
                                        style={{ height: `${(d.cost / maxCost) * 100}%` }}
                                        title={`${d.day}: $${d.cost.toFixed(2)}`}
                                    />
                                ))}
                            </div>
                            <div className="cost-labels">
                                {COST_DATA.map((d, i) => (
                                    <span key={i}>{d.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
