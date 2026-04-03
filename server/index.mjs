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
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',') }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'abdosclaw-dashboard-bridge' })
})

app.get('/api/status', async (_req, res) => {
  try {
    const status = await getStatusSummary()
    res.json(status)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/sessions', async (_req, res) => {
  try {
    const sessions = await listSessions()
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/sessions/:sessionKey/history', async (req, res) => {
  try {
    const sessionKey = decodeURIComponent(req.params.sessionKey)
    const limit = Number(req.query.limit || 100)
    const history = await getSessionHistory(sessionKey, limit)
    res.json(history)
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.post('/api/sessions/:sessionKey/send', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`AbdosClaw dashboard bridge listening on http://localhost:${PORT}`)
})
