import { API_BASE } from '../api'

const SID_KEY = 'hr_sid'
const HEARTBEAT_MS = 20000

function getSessionId() {
  let sid = sessionStorage.getItem(SID_KEY)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(SID_KEY, sid)
  }
  return sid
}

export function track(event, label = '') {
  fetch(`${API_BASE}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      label,
      session_id: getSessionId(),
      referrer: document.referrer,
      ua: navigator.userAgent,
    }),
  }).catch(() => {})
}

// Pings while the tab is visible so we can measure time-on-site
// even for single-page visits that never navigate.
export function startHeartbeat(getLabel) {
  const ping = () => {
    const label = getLabel()
    if (document.visibilityState === 'visible' && label !== '/admin') track('heartbeat', label)
  }
  const id = setInterval(ping, HEARTBEAT_MS)
  return () => clearInterval(id)
}
