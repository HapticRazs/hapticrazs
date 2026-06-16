import { useState, useEffect, useCallback, useRef } from 'react'
import { API_BASE } from '../api'
import './Admin.css'

const hdrs = pwd => ({ 'x-admin-password': pwd, 'Content-Type': 'application/json' })

function parseUA(ua = '') {
  if (!ua) return '—'
  if (/iPhone/.test(ua)) return '📱 iPhone'
  if (/iPad/.test(ua)) return '📱 iPad'
  if (/Android/.test(ua)) return '📱 Android'
  if (/Mac/.test(ua)) return '🖥 macOS'
  if (/Windows/.test(ua)) return '🖥 Windows'
  if (/Linux/.test(ua)) return '🐧 Linux'
  return ua.slice(0, 28)
}

function fmtDate(d) {
  if (!d) return '—'
  try {
    const dt = new Date(String(d).replace(' ', 'T') + (String(d).includes('Z') ? '' : 'Z'))
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch { return String(d) }
}

function fmtSize(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

function catBadge(cat) {
  return { VFX: 'badge-vfx', Film: 'badge-film', Simulation: 'badge-sim', Commercial: 'badge-com', Animation: 'badge-vfx', TV: 'badge-film' }[cat] || 'badge-sim'
}

function BarChart({ data, valueKey, colorBase, colorHover }) {
  if (!data?.length) return <p className="adm-chart-empty">No data yet</p>
  const max = Math.max(...data.map(x => x[valueKey]), 1)
  return (
    <div className="adm-bars">
      {data.map((row, i) => {
        const pct = Math.max(3, (row[valueKey] / max) * 100)
        const label = row.day ? row.day.slice(5) : ''
        return (
          <div
            key={i}
            className="adm-bar"
            style={{ height: `${pct}%`, background: colorBase }}
            title={`${label}: ${row[valueKey]}`}
            onMouseEnter={e => { e.currentTarget.style.background = colorHover }}
            onMouseLeave={e => { e.currentTarget.style.background = colorBase }}
          />
        )
      })}
    </div>
  )
}

function HBarChart({ data }) {
  if (!data?.length) return <p className="adm-empty">No video plays yet</p>
  const max = data[0].total_plays
  return (
    <div className="adm-h-bars">
      {data.slice(0, 8).map((v, i) => (
        <div key={i} className="adm-h-bar-row">
          <span className="adm-h-bar-label" title={v.label}>{v.label}</span>
          <div className="adm-h-bar-track">
            <div className="adm-h-bar-fill" style={{ width: `${max ? Math.round(v.total_plays / max * 100) : 0}%` }} />
          </div>
          <span className="adm-h-bar-count">{v.total_plays}</span>
        </div>
      ))}
    </div>
  )
}

const EMPTY_FORM = {
  title: '', subtitle: '', category: 'VFX', year: new Date().getFullYear(),
  description: '', behance_id: '', behance_url: '', external_url: '',
  imdb_url: '', pbs_url: '', tags: '', order_index: 0, featured: false,
}

const TABS = ['overview', 'videos', 'visitors', 'messages', 'projects', 'files']

export default function Admin() {
  const [pwd, setPwd] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [modal, setModal] = useState({ open: false, project: null })
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploadMsg, setUploadMsg] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()
  const authedPwd = useRef('')

  const getHdrs = useCallback(() => hdrs(authedPwd.current), [])

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin/stats`, { headers: getHdrs() })
      setStats(await r.json())
      setLastUpdated(new Date())
    } catch { /* backend offline */ }
  }, [getHdrs])

  const loadProjects = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin/projects`, { headers: getHdrs() })
      setProjects(await r.json())
    } catch { /* */ }
  }, [getHdrs])

  const loadFiles = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin/files`, { headers: getHdrs() })
      setFiles(await r.json())
    } catch { /* */ }
  }, [getHdrs])

  const loadAll = useCallback(() => Promise.all([loadStats(), loadProjects(), loadFiles()]), [loadStats, loadProjects, loadFiles])

  useEffect(() => {
    if (!authed) return
    loadAll()
    const iv = setInterval(loadStats, 30000)
    return () => clearInterval(iv)
  }, [authed, loadAll, loadStats])

  async function login() {
    setLoginErr('')
    try {
      const r = await fetch(`${API_BASE}/api/admin/stats`, { headers: hdrs(pwd) })
      if (r.ok) {
        authedPwd.current = pwd
        setAuthed(true)
      } else if (r.status === 401) {
        setLoginErr('Incorrect password')
      } else {
        setLoginErr('Backend not reachable — deploy the backend first.')
      }
    } catch {
      setLoginErr('Backend not reachable — deploy the backend first.')
    }
  }

  async function markRead(id) {
    await fetch(`${API_BASE}/api/admin/messages/${id}/read`, { method: 'POST', headers: getHdrs() })
    loadStats()
  }

  function openModal(project = null) {
    setForm(project ? {
      title: project.title || '',
      subtitle: project.subtitle || '',
      category: project.category || 'VFX',
      year: project.year || new Date().getFullYear(),
      description: project.description || '',
      behance_id: project.behance_id || '',
      behance_url: project.behance_url || '',
      external_url: project.external_url || '',
      imdb_url: project.imdb_url || '',
      pbs_url: project.pbs_url || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      order_index: project.order_index ?? 0,
      featured: !!project.featured,
    } : EMPTY_FORM)
    setModal({ open: true, project })
  }

  function setF(key) { return e => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })) }

  async function saveProject(e) {
    e.preventDefault()
    const body = {
      ...form,
      year: parseInt(form.year) || new Date().getFullYear(),
      order_index: parseInt(form.order_index) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: form.featured ? 1 : 0,
    }
    const id = modal.project?.id
    await fetch(
      id ? `${API_BASE}/api/admin/projects/${id}` : `${API_BASE}/api/admin/projects`,
      { method: id ? 'PUT' : 'POST', headers: getHdrs(), body: JSON.stringify(body) }
    )
    setModal({ open: false, project: null })
    loadProjects()
  }

  async function deleteProject(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`${API_BASE}/api/admin/projects/${id}`, { method: 'DELETE', headers: getHdrs() })
    loadProjects()
  }

  async function uploadFile(file) {
    if (!file) return
    setUploadMsg({ type: '', text: `Uploading ${file.name}…` })
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch(`${API_BASE}/api/admin/upload`, { method: 'POST', headers: { 'x-admin-password': authedPwd.current }, body: fd })
      const data = await r.json()
      if (data.ok) {
        setUploadMsg({ type: 'ok', text: `✓ Uploaded — ${data.filename} (${fmtSize(data.size)})` })
        loadFiles()
      } else {
        setUploadMsg({ type: 'err', text: '✗ ' + (data.error || 'Upload failed') })
      }
    } catch {
      setUploadMsg({ type: 'err', text: '✗ Upload error' })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function deleteFile(name) {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`${API_BASE}/api/admin/files/${encodeURIComponent(name)}`, { method: 'DELETE', headers: getHdrs() })
    loadFiles()
  }

  // ── Login ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <h1>Haptic <span className="adm-grad">Razs</span></h1>
          <p>Analytics &amp; Content Management</p>
          <input
            type="password"
            placeholder="Admin password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          <button className="adm-btn-grad" onClick={login}>Enter Dashboard</button>
          {loginErr && <p className="adm-login-err">{loginErr}</p>}
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────
  const playMap = {}
  if (stats) stats.videoBreakdown?.forEach(v => { playMap[v.label] = v })

  const videoRows = [...projects]
    .map(p => ({ p, s: playMap[p.title] || { total_plays: 0, unique_viewers: 0, plays_week: 0, plays_month: 0, last_played: null } }))
    .sort((a, b) => b.s.total_plays - a.s.total_plays)

  return (
    <div className="adm">
      {/* Header */}
      <header className="adm-header">
        <div className="adm-logo">Haptic <span className="adm-grad">Razs</span> Admin</div>
        <div className="adm-header-right">
          {lastUpdated && <span className="adm-meta">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <button className="adm-btn-ghost" onClick={loadAll}>↻ Refresh</button>
        </div>
      </header>

      <div className="adm-body">
        {/* Stat cards */}
        <div className="adm-stat-row">
          {[
            { label: 'Total Page Views', val: stats?.pageViews.total, sub: 'All time' },
            { label: 'Today', val: stats?.pageViews.today, sub: 'Page views' },
            { label: 'This Week', val: stats?.pageViews.week, sub: 'Last 7 days' },
            { label: 'Video Plays', val: stats?.totalVideoPlays, sub: 'All time' },
            { label: 'Unread Messages', val: stats?.unreadMessages, sub: 'New inquiries' },
          ].map(({ label, val, sub }) => (
            <div key={label} className="adm-stat-card">
              <div className="adm-stat-label">{label}</div>
              <div className="adm-stat-val">{val == null ? '—' : typeof val === 'number' ? val.toLocaleString() : val}</div>
              <div className="adm-stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          {TABS.map(tab => (
            <button key={tab} className={`adm-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'messages' && (stats?.unreadMessages > 0) && (
                <span className="adm-tab-badge">{stats.unreadMessages}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div>
            <div className="adm-two-col">
              <div className="adm-card">
                <div className="adm-card-head"><h3>Daily Page Views (30 days)</h3></div>
                <div className="adm-chart-wrap">
                  <BarChart data={stats?.dailyViews} valueKey="views" colorBase="rgba(232,118,64,.35)" colorHover="rgba(232,118,64,.8)" />
                </div>
              </div>
              <div className="adm-card">
                <div className="adm-card-head"><h3>Daily Video Plays (30 days)</h3></div>
                <div className="adm-chart-wrap">
                  <BarChart data={stats?.dailyVideoPlays} valueKey="plays" colorBase="rgba(192,50,88,.35)" colorHover="rgba(192,50,88,.8)" />
                </div>
              </div>
            </div>
            <div className="adm-two-col">
              <div className="adm-card">
                <div className="adm-card-head"><h3>Top Pages</h3></div>
                <table className="adm-table">
                  <thead><tr><th>Page</th><th style={{ textAlign: 'right' }}>Views</th></tr></thead>
                  <tbody>
                    {stats?.topPages.length
                      ? stats.topPages.map((p, i) => (
                          <tr key={i}>
                            <td><code style={{ fontSize: '.75rem', color: '#aaa' }}>{p.label || '/'}</code></td>
                            <td style={{ textAlign: 'right', color: 'var(--adm-orange)', fontWeight: 600 }}>{p.views}</td>
                          </tr>
                        ))
                      : <tr><td colSpan="2" className="adm-empty">No data yet</td></tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="adm-card">
                <div className="adm-card-head"><h3>Top Videos by Plays</h3></div>
                <HBarChart data={stats?.videoBreakdown} />
              </div>
            </div>
          </div>
        )}

        {/* ── Videos ── */}
        {activeTab === 'videos' && (
          <div>
            <div className="adm-card">
              <div className="adm-card-head">
                <h3>All Projects — Video Analytics</h3>
                <span style={{ fontSize: '.72rem', color: 'var(--adm-muted)' }}>{stats?.totalVideoPlays?.toLocaleString()} total plays</span>
              </div>
              <div className="adm-table-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Project</th><th>Category</th><th>Year</th>
                      <th style={{ textAlign: 'right' }}>Total Plays</th>
                      <th style={{ textAlign: 'right' }}>Unique</th>
                      <th style={{ textAlign: 'right' }}>Week</th>
                      <th style={{ textAlign: 'right' }}>Month</th>
                      <th>Last Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videoRows.map(({ p, s }) => (
                      <tr key={p.id}>
                        <td>
                          <strong style={{ color: 'var(--adm-text)', fontSize: '.82rem' }}>{p.title}</strong>
                          {p.subtitle && <div style={{ fontSize: '.7rem', color: 'var(--adm-dim)' }}>{p.subtitle}</div>}
                        </td>
                        <td><span className={`adm-badge ${catBadge(p.category)}`}>{p.category}</span></td>
                        <td style={{ color: 'var(--adm-dim)' }}>{p.year}</td>
                        <td style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 700, color: 'var(--adm-orange)' }}>{s.total_plays || 0}</td>
                        <td style={{ textAlign: 'right', color: 'var(--adm-muted)' }}>{s.unique_viewers || 0}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ color: (s.plays_week || 0) > 0 ? 'var(--adm-green)' : 'var(--adm-dim)', fontSize: '.7rem' }}>{s.plays_week || 0}</span>
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--adm-muted)' }}>{s.plays_month || 0}</td>
                        <td style={{ color: 'var(--adm-dim)', fontSize: '.72rem' }}>{fmtDate(s.last_played)}</td>
                      </tr>
                    ))}
                    {!videoRows.length && <tr><td colSpan="8" className="adm-empty">No projects yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="adm-two-col">
              <div className="adm-card">
                <div className="adm-card-head"><h3>Video Plays — 30 Day Chart</h3></div>
                <div className="adm-chart-wrap">
                  <BarChart data={stats?.dailyVideoPlays} valueKey="plays" colorBase="rgba(192,50,88,.35)" colorHover="rgba(192,50,88,.8)" />
                </div>
              </div>
              <div className="adm-card">
                <div className="adm-card-head"><h3>Recent Video Activity</h3></div>
                <table className="adm-table">
                  <thead><tr><th>Video</th><th>IP</th><th>Device</th><th>Time</th></tr></thead>
                  <tbody>
                    {stats?.recentVideoPlays.length
                      ? stats.recentVideoPlays.map((v, i) => (
                          <tr key={i}>
                            <td style={{ fontSize: '.82rem' }}>{v.label}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '.7rem' }}>{v.ip || '—'}</td>
                            <td>{parseUA(v.ua)}</td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '.72rem' }}>{fmtDate(v.created_at)}</td>
                          </tr>
                        ))
                      : <tr><td colSpan="4" className="adm-empty">No video plays yet</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Visitors ── */}
        {activeTab === 'visitors' && (
          <div className="adm-card">
            <div className="adm-card-head"><h3>Recent Visitors (last 50)</h3></div>
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead><tr><th>Page</th><th>IP</th><th>Referrer</th><th>Device</th><th>Time</th></tr></thead>
                <tbody>
                  {stats?.recentVisitors.length
                    ? stats.recentVisitors.map((v, i) => (
                        <tr key={i}>
                          <td><code style={{ fontSize: '.72rem', color: '#aaa' }}>{v.label || '/'}</code></td>
                          <td style={{ fontFamily: 'monospace', fontSize: '.7rem' }}>{v.ip || '—'}</td>
                          <td style={{ fontSize: '.7rem', color: 'var(--adm-dim)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.referrer || 'direct'}</td>
                          <td>{parseUA(v.ua)}</td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '.72rem' }}>{fmtDate(v.created_at)}</td>
                        </tr>
                      ))
                    : <tr><td colSpan="5" className="adm-empty">No visitors yet</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {activeTab === 'messages' && (
          <div>
            {stats?.messages.length
              ? stats.messages.map(m => (
                  <div key={m.id} className={`adm-msg-card ${m.read ? '' : 'unread'}`}>
                    <div className="adm-msg-head">
                      <div>
                        <div className="adm-msg-from">
                          {m.name}{' '}
                          <span className={`adm-badge ${m.read ? 'badge-read' : 'badge-unread'}`}>{m.read ? 'read' : 'new'}</span>
                        </div>
                        <div className="adm-msg-email"><a href={`mailto:${m.email}`}>{m.email}</a></div>
                      </div>
                      <div className="adm-msg-date">{fmtDate(m.created_at)}</div>
                    </div>
                    <div className="adm-msg-body">
                      {m.message.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                    </div>
                    <div className="adm-msg-foot">
                      {m.company && <span className="adm-msg-detail">🏢 {m.company}</span>}
                      {m.service && <span className="adm-msg-detail">🎬 {m.service}</span>}
                      {m.budget && <span className="adm-msg-detail">💰 {m.budget}</span>}
                      {!m.read && <button className="adm-btn-sm" onClick={() => markRead(m.id)}>Mark read</button>}
                      <a href={`mailto:${m.email}?subject=Re: Haptic Razs Inquiry`} className="adm-btn-sm">Reply →</a>
                    </div>
                  </div>
                ))
              : <div className="adm-empty" style={{ padding: '4rem' }}>No messages yet</div>
            }
          </div>
        )}

        {/* ── Projects ── */}
        {activeTab === 'projects' && (
          <div className="adm-card">
            <div className="adm-card-head">
              <h3>Projects ({projects.length})</h3>
              <button className="adm-btn-ghost adm-btn-orange" onClick={() => openModal()}>+ Add Project</button>
            </div>
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order</th><th>Title</th><th>Category</th><th>Year</th>
                    <th>Behance ID</th><th>Featured</th>
                    <th style={{ textAlign: 'right' }}>Plays</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--adm-dim)' }}>{p.order_index}</td>
                      <td>
                        <strong style={{ color: 'var(--adm-text)' }}>{p.title}</strong>
                        {p.subtitle && <div style={{ fontSize: '.7rem', color: 'var(--adm-dim)' }}>{p.subtitle}</div>}
                      </td>
                      <td><span className={`adm-badge ${catBadge(p.category)}`}>{p.category}</span></td>
                      <td style={{ color: 'var(--adm-dim)' }}>{p.year}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '.7rem', color: 'var(--adm-muted)' }}>{p.behance_id || '—'}</td>
                      <td>{p.featured ? <span className="adm-badge badge-feat">Yes</span> : <span style={{ color: 'var(--adm-dim)' }}>—</span>}</td>
                      <td style={{ textAlign: 'right', color: 'var(--adm-orange)', fontWeight: 600 }}>{playMap[p.title]?.total_plays || 0}</td>
                      <td>
                        <div className="adm-proj-actions">
                          {(p.behance_url || p.behance_id) && (
                            <a href={p.behance_url || `https://www.behance.net/gallery/${p.behance_id}`} target="_blank" rel="noreferrer" className="adm-btn-sm">↗</a>
                          )}
                          <button className="adm-btn-sm" onClick={() => openModal(p)}>Edit</button>
                          <button className="adm-btn-danger" onClick={() => deleteProject(p.id, p.title)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!projects.length && <tr><td colSpan="8" className="adm-empty">No projects</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Files ── */}
        {activeTab === 'files' && (
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><h3>Upload File</h3></div>
              <div style={{ padding: '1.25rem' }}>
                <div
                  className={`adm-upload-zone ${dragOver ? 'drag' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); uploadFile(e.dataTransfer.files[0]) }}
                >
                  <p>Click to choose a file, or drag &amp; drop here</p>
                  <small>PDF, PNG, JPG, WebP, MP4, MOV — max 50 MB</small>
                </div>
                {uploadMsg && <div className={`adm-upload-msg ${uploadMsg.type}`}>{uploadMsg.text}</div>}
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov"
                  onChange={e => uploadFile(e.target.files[0])}
                />
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-head"><h3>Uploaded Files</h3></div>
              {files.length
                ? files.map(f => (
                    <div key={f.name} className="adm-file-item">
                      <span className="adm-file-name" title={f.name}>{f.name}</span>
                      <span className="adm-file-size">{fmtSize(f.size)}</span>
                      <span className="adm-file-date">{fmtDate(f.modified)}</span>
                      <div className="adm-file-actions">
                        <a href={`${API_BASE}${f.url}`} target="_blank" rel="noreferrer" className="adm-btn-sm">View</a>
                        <a href={`${API_BASE}${f.url}`} download className="adm-btn-sm">↓</a>
                        <button className="adm-btn-danger" onClick={() => deleteFile(f.name)}>✕</button>
                      </div>
                    </div>
                  ))
                : <div className="adm-empty">No files uploaded yet</div>
              }
            </div>
          </div>
        )}
      </div>

      {/* ── Project Modal ── */}
      {modal.open && (
        <div className="adm-modal-bg" onClick={e => e.target === e.currentTarget && setModal({ open: false, project: null })}>
          <div className="adm-modal-box">
            <div className="adm-modal-top">
              <h2>{modal.project ? 'Edit Project' : 'Add Project'}</h2>
              <button className="adm-modal-close" onClick={() => setModal({ open: false, project: null })}>✕</button>
            </div>
            <form className="adm-modal-form" onSubmit={saveProject}>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Title *</label>
                  <input required value={form.title} onChange={setF('title')} placeholder="VFX Reel 2027" />
                </div>
                <div className="adm-form-group">
                  <label>Subtitle</label>
                  <input value={form.subtitle} onChange={setF('subtitle')} placeholder="Visual Effects Reel" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={setF('category')}>
                    {['VFX', 'Film', 'Simulation', 'Commercial', 'Animation', 'TV', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Year</label>
                  <input type="number" min="2000" max="2035" value={form.year} onChange={setF('year')} />
                </div>
              </div>
              <div className="adm-form-group">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={setF('description')} />
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Behance ID</label>
                  <input value={form.behance_id} onChange={setF('behance_id')} placeholder="218145705" />
                </div>
                <div className="adm-form-group">
                  <label>Behance URL</label>
                  <input type="url" value={form.behance_url} onChange={setF('behance_url')} placeholder="https://www.behance.net/gallery/…" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>External URL</label>
                  <input type="url" value={form.external_url} onChange={setF('external_url')} placeholder="https://…" />
                </div>
                <div className="adm-form-group">
                  <label>IMDb URL</label>
                  <input type="url" value={form.imdb_url} onChange={setF('imdb_url')} placeholder="https://www.imdb.com/title/…" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Tags <span className="adm-label-hint">(comma-separated)</span></label>
                  <input value={form.tags} onChange={setF('tags')} placeholder="vfx, simulation, reel" />
                </div>
                <div className="adm-form-group">
                  <label>Order Index <span className="adm-label-hint">(lower = first)</span></label>
                  <input type="number" value={form.order_index} onChange={setF('order_index')} />
                </div>
              </div>
              <div className="adm-form-check">
                <input type="checkbox" id="adm-featured" checked={form.featured} onChange={setF('featured')} />
                <label htmlFor="adm-featured">Featured on home page</label>
              </div>
              <div className="adm-modal-foot">
                <button type="button" className="adm-btn-cancel" onClick={() => setModal({ open: false, project: null })}>Cancel</button>
                <button type="submit" className="adm-btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
