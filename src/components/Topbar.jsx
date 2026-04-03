export default function Topbar({ title, subtitle, currentTime, agentStatus }) {
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <header className="topbar">
            <div className="topbar-left">
                <div>
                    <div className="topbar-title">{title}</div>
                    <div className="topbar-subtitle">{subtitle}</div>
                </div>
            </div>
            <div className="topbar-right">
                <div className="topbar-time">
                    {formatDate(currentTime)} · {formatTime(currentTime)}
                </div>
                <button className="topbar-btn">
                    🔔 Alerts
                </button>
                <button className="topbar-btn primary">
                    + New Task
                </button>
            </div>
        </header>
    )
}
