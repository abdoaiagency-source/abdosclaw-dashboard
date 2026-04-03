const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  return response.json()
}

export function getSessions() {
  return request('/api/sessions')
}

export function getSessionHistory(sessionKey, limit = 100) {
  return request(`/api/sessions/${encodeURIComponent(sessionKey)}/history?limit=${limit}`)
}

export function sendSessionMessage(sessionKey, message) {
  return request(`/api/sessions/${encodeURIComponent(sessionKey)}/send`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export function getStatus() {
  return request('/api/status')
}
