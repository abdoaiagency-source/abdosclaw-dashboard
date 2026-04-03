export default function Sidebar({ activePanel, setActivePanel, agentStatus }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">🦅</div>
                    <div className="sidebar-logo-text">
                        <h1>AbdosClaw</h1>
                        <span>Mission Control</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-label">Operations</div>
                <div
                    className={`nav-item ${activePanel === 'command' ? 'active' : ''}`}
                    onClick={() => setActivePanel('command')}
                >
                    <span className="nav-icon">⚡</span>
                    Command
                    <span className="nav-badge">Live</span>
                </div>
                <div
                    className={`nav-item ${activePanel === 'forge' ? 'active' : ''}`}
                    onClick={() => setActivePanel('forge')}
                >
                    <span className="nav-icon">🎬</span>
                    The Forge
                </div>
                <div
                    className={`nav-item ${activePanel === 'hangar' ? 'active' : ''}`}
                    onClick={() => setActivePanel('hangar')}
                >
                    <span className="nav-icon">📦</span>
                    The Hangar
                </div>

                <div className="nav-section-label">Quick Access</div>
                <div className="nav-item" onClick={() => window.open('https://github.com', '_blank')}>
                    <span className="nav-icon">🔗</span>
                    GitHub
                </div>
                <div className="nav-item" onClick={() => window.open('#', '_blank')}>
                    <span className="nav-icon">🌐</span>
                    VPS Panel
                </div>
                <div className="nav-item" onClick={() => window.open('#', '_blank')}>
                    <span className="nav-icon">📊</span>
                    OpenRouter
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-status">
                    <div className={`status-dot ${agentStatus}`}></div>
                    <div className="status-info">
                        <div className="status-label">
                            OpenClaw Agent
                        </div>
                        <div className="status-detail">
                            {agentStatus === 'online' && 'Idle — Ready for tasks'}
                            {agentStatus === 'busy' && 'Processing request...'}
                            {agentStatus === 'offline' && 'Disconnected'}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
