import { execFile } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw'
const OPENCLAW_WORKDIR = process.env.OPENCLAW_WORKDIR || '/data/.openclaw/workspace'
const AGENT_ID = process.env.OPENCLAW_AGENT_ID || 'main'
const STATE_DIR = process.env.OPENCLAW_STATE_DIR || '/data/.openclaw'
const SESSIONS_DIR = path.join(STATE_DIR, 'agents', AGENT_ID, 'sessions')
const SESSIONS_INDEX = path.join(SESSIONS_DIR, 'sessions.json')

function flattenContentBlocks(content = []) {
  if (!Array.isArray(content)) return ''
  return content
    .map((block) => {
      if (!block || typeof block !== 'object') return ''
      if (block.type === 'text') return block.text || ''
      if (block.type === 'toolCall') return `[Tool call: ${block.name || 'unknown'}]`
      if (block.type === 'thinking') return ''
      return `[${block.type || 'content'}]`
    })
    .filter(Boolean)
    .join('\n')
    .trim()
}

function summarizeMessageRole(rawRole) {
  if (rawRole === 'toolResult') return 'tool'
  return rawRole || 'system'
}

function sessionTitleFromKey(key) {
  if (!key) return 'Unknown session'
  const parts = String(key).split(':')
  if (parts.includes('telegram')) return `Telegram / ${parts.at(-1)}`
  if (parts.includes('discord')) return `Discord / ${parts.at(-1)}`
  if (parts.includes('subagent')) return `Subagent / ${parts.at(-1)?.slice(0, 8)}`
  if (parts.includes('main')) return 'Main session'
  return key
}

export async function listSessions() {
  const { stdout } = await execFileAsync(OPENCLAW_BIN, ['sessions', '--agent', AGENT_ID, '--json'], {
    cwd: OPENCLAW_WORKDIR,
    maxBuffer: 10 * 1024 * 1024,
  })
  const parsed = JSON.parse(stdout)
  const items = Array.isArray(parsed?.items)
    ? parsed.items
    : Array.isArray(parsed?.sessions)
      ? parsed.sessions
      : []
  return items.map((item) => ({
    key: item.key,
    sessionId: item.sessionId,
    title: sessionTitleFromKey(item.key),
    kind: item.kind || 'direct',
    model: item.modelProvider && item.model ? `${item.modelProvider}/${item.model}` : (item.model || 'unknown'),
    lastActivity: item.updatedAt || null,
    lastMessage: item.origin?.label || item.key,
    agentId: item.agentId || AGENT_ID,
  }))
}

export async function getSessionsIndex() {
  const raw = await fs.readFile(SESSIONS_INDEX, 'utf8')
  return JSON.parse(raw)
}

export async function getSessionMetaByKey(sessionKey) {
  const index = await getSessionsIndex()
  const entry = index[sessionKey]
  if (!entry) return null
  return entry
}

async function writeSessionsIndex(index) {
  await fs.writeFile(SESSIONS_INDEX, JSON.stringify(index, null, 2))
}

async function ensureSessionOverrides(sessionKey) {
  const index = await getSessionsIndex()
  const entry = index[sessionKey]
  if (!entry) return null

  const providerOverride = typeof entry.providerOverride === 'string' ? entry.providerOverride.trim() : ''
  const modelOverride = typeof entry.modelOverride === 'string' ? entry.modelOverride.trim() : ''
  const modelProvider = typeof entry.modelProvider === 'string' ? entry.modelProvider.trim() : ''
  const model = typeof entry.model === 'string' ? entry.model.trim() : ''

  if (providerOverride || modelOverride) {
    return entry
  }

  if (!modelProvider || !model) {
    return entry
  }

  entry.providerOverride = modelProvider
  entry.modelOverride = model
  index[sessionKey] = entry
  await writeSessionsIndex(index)
  return entry
}

export async function getSessionHistory(sessionKey, limit = 100) {
  const meta = await getSessionMetaByKey(sessionKey)
  if (!meta?.sessionFile) {
    return { sessionKey, sessionId: null, messages: [] }
  }
  const raw = await fs.readFile(meta.sessionFile, 'utf8')
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const parsed = lines
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean)

  const messages = parsed
    .filter((entry) => entry.type === 'message' && entry.message)
    .map((entry) => ({
      id: entry.id,
      role: summarizeMessageRole(entry.message.role),
      text: flattenContentBlocks(entry.message.content),
      timestamp: entry.timestamp || entry.message.timestamp || null,
      rawRole: entry.message.role,
      provider: entry.message.provider || null,
      model: entry.message.model || null,
      errorMessage: entry.message.errorMessage || null,
    }))
    .filter((msg) => msg.text || msg.errorMessage)
    .map((msg) => ({
      ...msg,
      text: msg.text || msg.errorMessage || '[empty message]',
    }))

  return {
    sessionKey,
    sessionId: meta.sessionId || null,
    messages: messages.slice(-limit),
  }
}

export async function sendMessageToSession(sessionKey, message) {
  const meta = await ensureSessionOverrides(sessionKey)
  if (!meta?.sessionId) {
    throw new Error(`Session not found: ${sessionKey}`)
  }
  const { stdout, stderr } = await execFileAsync(
    OPENCLAW_BIN,
    ['agent', '--agent', AGENT_ID, '--session-id', meta.sessionId, '--message', message, '--json'],
    {
      cwd: OPENCLAW_WORKDIR,
      maxBuffer: 10 * 1024 * 1024,
      timeout: 180000,
    }
  )

  let parsed = null
  try {
    parsed = JSON.parse(stdout)
  } catch {
    parsed = { raw: stdout }
  }

  return {
    ok: true,
    sessionKey,
    sessionId: meta.sessionId,
    stdout: parsed,
    stderr: stderr || null,
  }
}

export async function getStatusSummary() {
  const sessions = await listSessions()
  return {
    ok: true,
    agent: AGENT_ID,
    sessionCount: sessions.length,
    activeSessions: sessions.slice(0, 10),
  }
}
