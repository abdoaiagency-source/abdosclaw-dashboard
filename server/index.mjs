import express from 'express'
import cors from 'cors'
import {
  listSessions,
  getSessionHistory,
  sendMessageToSession,
  getStatusSummary,
} from './openclaw.mjs'

const app = express()
const PORT = Number(process.env.PORT || 8787)
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
const DASHBOARD_API_TOKEN = String(process.env.DASHBOARD_API_TOKEN || '').trim()
const DASHBOARD_ENABLE_WRITE = String(process.env.DASHBOARD_ENABLE_WRITE || 'false').trim().toLowerCase() === 'true'
const allowedOrigins = CORS_ORIGIN.split(',').map((item) => item.trim()).filter(Boolean)

function getRequestToken(req) {
  const authHeader = String(req.headers.authorization || '').trim()
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim()
  }
  return String(req.headers['x-api-token'] || '').trim()
}

function isLoopbackRequest(req) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').trim()
  const ip = forwardedFor.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || ''
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'].includes(ip)
}

function requireReadAuth(req, res, next) {
  if (DASHBOARD_API_TOKEN) {
    const token = getRequestToken(req)
    if (!token || token !== DASHBOARD_API_TOKEN) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }
    return next()
  }

  if (!isLoopbackRequest(req)) {
    return res.status(403).json({ ok: false, error: 'Read access is limited to local requests until DASHBOARD_API_TOKEN is configured' })
  }

  return next()
}

function requireWriteAuth(req, res, next) {
  if (!DASHBOARD_ENABLE_WRITE) {
    return res.status(403).json({ ok: false, error: 'Write actions are disabled. Set DASHBOARD_ENABLE_WRITE=true to allow sends.' })
  }

  if (!DASHBOARD_API_TOKEN) {
    return res.status(403).json({ ok: false, error: 'Write actions require DASHBOARD_API_TOKEN to be configured.' })
  }

  const token = getRequestToken(req)
  if (!token || token !== DASHBOARD_API_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  return next()
}

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('CORS blocked'))
  },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'abdosclaw-dashboard-bridge',
    authConfigured: Boolean(DASHBOARD_API_TOKEN),
    writeEnabled: DASHBOARD_ENABLE_WRITE,
  })
})

app.get('/api/status', requireReadAuth, async (_req, res) => {
  try {
    const status = await getStatusSummary()
    res.json(status)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/sessions', requireReadAuth, async (_req, res) => {
  try {
    const sessions = await listSessions()
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/sessions/:sessionKey/history', requireReadAuth, async (req, res) => {
  try {
    const sessionKey = decodeURIComponent(req.params.sessionKey)
    const limit = Number(req.query.limit || 100)
    const history = await getSessionHistory(sessionKey, limit)
    res.json(history)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.post('/api/sessions/:sessionKey/send', requireWriteAuth, async (req, res) => {
  try {
    const sessionKey = decodeURIComponent(req.params.sessionKey)
    const message = String(req.body?.message || '').trim()
    if (!message) {
      return res.status(400).json({ ok: false, error: 'Message is required' })
    }
    const result = await sendMessageToSession(sessionKey, message)
    res.json(result)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.use((error, _req, res, _next) => {
  if (error?.message === 'CORS blocked') {
    return res.status(403).json({ ok: false, error: 'CORS blocked' })
  }
  return res.status(500).json({ ok: false, error: error?.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`AbdosClaw dashboard bridge listening on http://localhost:${PORT}`)
})
