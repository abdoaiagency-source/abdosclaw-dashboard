const PROJECTS = [
    {
        id: 1,
        name: 'EffectWave Co.',
        description: 'Marketing agency website — React + Vite, deployed on Cloudflare Pages. SEO-optimized with pre-rendering.',
        status: 'live',
        tags: ['React', 'Vite', 'Cloudflare'],
        icon: '🌊',
        accentColor: '#45aaf2',
        links: [
            { label: 'Live Site', url: 'https://www.effectwaveco.com' },
            { label: 'GitHub', url: '#' },
        ],
        stats: { uptime: '99.9%', lastDeploy: '2 days ago' },
    },
    {
        id: 2,
        name: 'AbdosClaw Cockpit',
        description: 'This dashboard — mission control for OpenClaw agent, video generation pipeline, and project portfolio.',
        status: 'dev',
        tags: ['React', 'Vite', 'Dashboard'],
        icon: '🦅',
        accentColor: '#6c5ce7',
        links: [
            { label: 'Local Dev', url: 'http://localhost:5173' },
            { label: 'GitHub', url: '#' },
        ],
        stats: { uptime: 'Dev', lastDeploy: 'Now' },
    },
    {
        id: 3,
        name: 'OpenClaw Agent',
        description: 'Self-hosted AI agent on Hostinger VPS. Connected via Telegram. Gemini 2.5 Pro + OpenRouter.',
        status: 'live',
        tags: ['AI Agent', 'VPS', 'Telegram'],
        icon: '🤖',
        accentColor: '#00d2a0',
        links: [
            { label: 'VPS Panel', url: '#' },
            { label: 'Logs', url: '#' },
        ],
        stats: { uptime: '97.2%', lastDeploy: '1 day ago' },
    },
    {
        id: 4,
        name: 'Artisan Pro',
        description: 'Product photography generator — drag-and-drop uploads, AI prompt engineering, chroma key selection.',
        status: 'dev',
        tags: ['AI', 'Image Gen', 'Kie API'],
        icon: '📸',
        accentColor: '#ffa502',
        links: [
            { label: 'GitHub', url: '#' },
        ],
        stats: { uptime: 'Dev', lastDeploy: '3 days ago' },
    },
    {
        id: 5,
        name: 'Side Effect — Client',
        description: 'Brand management and content creation for Side Effect. Social media, video production, marketing.',
        status: 'live',
        tags: ['Client', 'Marketing', 'Video'],
        icon: '🎯',
        accentColor: '#ff4757',
        links: [
            { label: 'Content Hub', url: '#' },
            { label: 'Analytics', url: '#' },
        ],
        stats: { uptime: 'Active', lastDeploy: 'Ongoing' },
    },
    {
        id: 6,
        name: 'AI Video Pipeline',
        description: 'Automated video generation workflow — script → image → video → publish. n8n + Runway + Kling.',
        status: 'planned',
        tags: ['n8n', 'Runway', 'Automation'],
        icon: '🎬',
        accentColor: '#a29bfe',
        links: [],
        stats: { uptime: 'Planned', lastDeploy: 'Not started' },
    },
]

export default function HangarPanel() {
    return (
        <div>
            {/* Section header */}
            <div className="section-header section-gap">
                <h2>
                    <span>📦</span> Project Portfolio
                </h2>
                <button className="topbar-btn primary">+ New Project</button>
            </div>

            {/* Summary Stats */}
            <div className="grid-3 section-gap">
                <div className="stat-card animate-in">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>
                        {PROJECTS.filter(p => p.status === 'live').length}
                    </div>
                    <div className="stat-label">Live Projects</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">🟡</div>
                    <div className="stat-value" style={{ color: 'var(--yellow)' }}>
                        {PROJECTS.filter(p => p.status === 'dev').length}
                    </div>
                    <div className="stat-label">In Development</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">🔵</div>
                    <div className="stat-value" style={{ color: 'var(--blue)' }}>
                        {PROJECTS.filter(p => p.status === 'planned').length}
                    </div>
                    <div className="stat-label">Planned</div>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid-3">
                {PROJECTS.map((project) => (
                    <div
                        className="project-card animate-in"
                        key={project.id}
                        style={{ '--card-accent': project.accentColor }}
                    >
                        <div className="project-card-header">
                            <div
                                className="project-card-icon"
                                style={{ background: `${project.accentColor}15` }}
                            >
                                {project.icon}
                            </div>
                            <span className={`project-card-status ${project.status}`}>
                                {project.status}
                            </span>
                        </div>

                        <h4>{project.name}</h4>
                        <p>{project.description}</p>

                        <div className="project-card-tags">
                            {project.tags.map((tag, i) => (
                                <span className="tag" key={i}>{tag}</span>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            marginBottom: '12px',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            <span>⬆ {project.stats.uptime}</span>
                            <span>🚀 {project.stats.lastDeploy}</span>
                        </div>

                        {project.links.length > 0 && (
                            <div className="project-card-links">
                                {project.links.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noreferrer">
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
