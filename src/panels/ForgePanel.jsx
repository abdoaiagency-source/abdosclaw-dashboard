import { useState } from 'react'

const QUEUE_ITEMS = [
    {
        id: 1,
        title: 'Product Showcase — Wireless Earbuds',
        type: 'Video',
        status: 'rendering',
        progress: 67,
        eta: '~3 min',
        icon: '🎧',
    },
    {
        id: 2,
        title: 'Side Effect Brand Reel',
        type: 'Video',
        status: 'rendering',
        progress: 34,
        eta: '~8 min',
        icon: '🎬',
    },
    {
        id: 3,
        title: 'EffectWave Social Ad — Arabic',
        type: 'Video',
        status: 'queued',
        progress: 0,
        eta: 'Waiting',
        icon: '📱',
    },
    {
        id: 4,
        title: 'AI Agent Demo Walkthrough',
        type: 'Video',
        status: 'queued',
        progress: 0,
        eta: 'Waiting',
        icon: '🤖',
    },
    {
        id: 5,
        title: 'Product Photography — Supplement Line',
        type: 'Image Batch',
        status: 'done',
        progress: 100,
        eta: 'Complete',
        icon: '💊',
    },
    {
        id: 6,
        title: 'Logo Animation — Client Branding',
        type: 'Motion',
        status: 'done',
        progress: 100,
        eta: 'Complete',
        icon: '✨',
    },
    {
        id: 7,
        title: 'Failed Render — Corrupted prompt',
        type: 'Video',
        status: 'failed',
        progress: 12,
        eta: 'Error',
        icon: '⚠️',
    },
]

const PROMPT_TEMPLATES = [
    { label: 'Product Hero Shot', prompt: 'Professional product photography, studio lighting, gradient background, 4K, commercial quality' },
    { label: 'Social Media Ad', prompt: 'Dynamic social media advertisement, bold typography, vibrant colors, call to action, Instagram optimized' },
    { label: 'Cinematic B-Roll', prompt: 'Cinematic slow motion footage, shallow depth of field, dramatic lighting, 24fps film grain' },
    { label: 'Explainer Video', prompt: 'Clean explainer video style, flat design, smooth transitions, modern corporate aesthetic' },
]

export default function ForgePanel() {
    const [promptText, setPromptText] = useState('')
    const [activeTab, setActiveTab] = useState('queue')

    const statusCount = {
        rendering: QUEUE_ITEMS.filter(q => q.status === 'rendering').length,
        queued: QUEUE_ITEMS.filter(q => q.status === 'queued').length,
        done: QUEUE_ITEMS.filter(q => q.status === 'done').length,
        failed: QUEUE_ITEMS.filter(q => q.status === 'failed').length,
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid-4 section-gap">
                <div className="stat-card animate-in">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-value" style={{ color: 'var(--accent-light)' }}>{statusCount.rendering}</div>
                    <div className="stat-label">Rendering</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{statusCount.queued}</div>
                    <div className="stat-label">In Queue</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>{statusCount.done}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card animate-in">
                    <div className="stat-icon">❌</div>
                    <div className="stat-value" style={{ color: 'var(--red)' }}>{statusCount.failed}</div>
                    <div className="stat-label">Failed</div>
                </div>
            </div>

            {/* Main content row */}
            <div className="grid-2 section-gap" style={{ gridTemplateColumns: '2fr 1fr' }}>
                {/* Generation Queue */}
                <div className="card animate-in">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">🎬</span>
                            <div>
                                <h3>Generation Queue</h3>
                                <span className="card-header-sub">{QUEUE_ITEMS.length} items</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['queue', 'done'].map(tab => (
                                <button
                                    key={tab}
                                    className={`topbar-btn ${activeTab === tab ? 'primary' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ fontSize: '11px', padding: '5px 12px' }}
                                >
                                    {tab === 'queue' ? 'Active' : 'History'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body no-pad">
                        {QUEUE_ITEMS
                            .filter(q => activeTab === 'queue'
                                ? (q.status === 'rendering' || q.status === 'queued')
                                : (q.status === 'done' || q.status === 'failed'))
                            .map(item => (
                                <div className="queue-item" key={item.id}>
                                    <div className="queue-thumb">{item.icon}</div>
                                    <div className="queue-info">
                                        <h5>{item.title}</h5>
                                        <span>{item.type} · {item.eta}</span>
                                        {item.status === 'rendering' && (
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`queue-status ${item.status}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Prompt Workspace */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="card animate-in">
                        <div className="card-header">
                            <div className="card-header-left">
                                <span className="card-header-icon">✍️</span>
                                <h3>Prompt Workspace</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <textarea
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'inherit',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                    outline: 'none',
                                    lineHeight: '1.6',
                                }}
                                placeholder="Describe your video or image generation task..."
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                            />
                            <button
                                className="topbar-btn primary"
                                style={{ width: '100%', marginTop: '10px', justifyContent: 'center', padding: '10px' }}
                            >
                                🚀 Add to Queue
                            </button>
                        </div>
                    </div>

                    {/* Templates */}
                    <div className="card animate-in">
                        <div className="card-header">
                            <div className="card-header-left">
                                <span className="card-header-icon">📝</span>
                                <h3>Quick Templates</h3>
                            </div>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {PROMPT_TEMPLATES.map((t, i) => (
                                <button
                                    key={i}
                                    className="action-btn"
                                    style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '10px 14px' }}
                                    onClick={() => setPromptText(t.prompt)}
                                >
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
