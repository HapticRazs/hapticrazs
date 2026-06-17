import express from 'express'
import cors from 'cors'
import { readFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'
import { createClient } from '@libsql/client'
import nodemailer from 'nodemailer'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ──────────────────────────────────────
let env = {}
const envPath = join(__dirname, '.env')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim()
  })
}
const ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'Hapticrazs@2023'
const PORT = env.PORT || process.env.PORT || 3001
const GMAIL_USER = env.GMAIL_USER || process.env.GMAIL_USER || 'akshatgobind56@gmail.com'
const GMAIL_APP_PASSWORD = env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || ''

// ── Database ──────────────────────────────────────
// TURSO_DATABASE_URL=libsql://... in production, file:./analytics.db locally
const db = createClient({
  url: env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || `file:${join(__dirname, 'analytics.db')}`,
  authToken: env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
})

// ── Upload dir ────────────────────────────────────
const UPLOADS_DIR = join(__dirname, 'uploads')
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Multer ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, safe)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.mov']
    cb(null, allowed.includes(extname(file.originalname).toLowerCase()))
  },
})

// ── Mailer ────────────────────────────────────────
let transporter = null
if (GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } })
}
async function sendEmailNotification(msg) {
  if (!transporter) return
  try {
    await transporter.sendMail({
      from: `"Haptic Razs Site" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `New message from ${msg.name} — Haptic Razs`,
      html: `<div style="font-family:sans-serif;max-width:600px;background:#0a0a0a;color:#eee;padding:32px;border-radius:8px">
        <h2 style="color:#e87640;margin-top:0">New inquiry on hapticrazs.com</h2>
        <p><strong>From:</strong> ${msg.name} &lt;<a href="mailto:${msg.email}" style="color:#e87640">${msg.email}</a>&gt;</p>
        ${msg.company ? `<p><strong>Company:</strong> ${msg.company}</p>` : ''}
        ${msg.service ? `<p><strong>Service:</strong> ${msg.service}</p>` : ''}
        ${msg.budget ? `<p><strong>Budget:</strong> ${msg.budget}</p>` : ''}
        <div style="background:#111;border:1px solid #222;border-radius:6px;padding:16px;margin-top:12px">
          <p style="margin:0;color:#aaa;line-height:1.6">${msg.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>`,
    })
  } catch (err) { console.error('Email error:', err.message) }
}

// ── Express ──────────────────────────────────────
const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173', 'https://hapticrazs.com', 'https://www.hapticrazs.com'] }))
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))
app.use(express.static(join(__dirname, 'public')))

const getIp = req => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

// ── Public: Projects ──────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const { rows } = await db.execute('SELECT * FROM projects ORDER BY order_index ASC, id ASC')
    res.json(rows.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Public: Track event ────────────────────────────
app.post('/api/track', async (req, res) => {
  const { event, label, referrer, ua } = req.body || {}
  if (!event) return res.status(400).json({ error: 'event required' })
  try {
    await db.execute({
      sql: 'INSERT INTO events (event,label,ip,ua,referrer) VALUES (?,?,?,?,?)',
      args: [event, label || '', getIp(req), ua || req.headers['user-agent'] || '', referrer || ''],
    })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Public: Contact form ───────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, budget, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' })
  try {
    await db.execute({
      sql: 'INSERT INTO messages (name,email,company,service,budget,message,ip) VALUES (?,?,?,?,?,?,?)',
      args: [name, email, company || '', service || '', budget || '', message, getIp(req)],
    })
    await db.execute({
      sql: 'INSERT INTO events (event,label,ip,ua,referrer) VALUES (?,?,?,?,?)',
      args: ['contact_form', `from:${name}`, getIp(req), req.headers['user-agent'] || '', ''],
    })
    await sendEmailNotification({ name, email, company, service, budget, message })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Admin auth ────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers['x-admin-password'] || req.query.pwd
  if (auth !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

// ── Admin: Stats ──────────────────────────────────
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [
      pvTotalR, pvTodayR, pvWeekR,
      topPagesR, recentVisitorsR, dailyViewsR,
      totalVideoPlaysR, videoBreakdownR, dailyVideoPlaysR, recentVideoPlaysR,
      messagesR, unreadR,
    ] = await db.batch([
      "SELECT COUNT(*) as n FROM events WHERE event='page_view'",
      "SELECT COUNT(*) as n FROM events WHERE event='page_view' AND date(created_at)=date('now')",
      "SELECT COUNT(*) as n FROM events WHERE event='page_view' AND created_at>=datetime('now','-7 days')",
      "SELECT label,COUNT(*) as views FROM events WHERE event='page_view' GROUP BY label ORDER BY views DESC LIMIT 10",
      "SELECT label,ip,ua,referrer,created_at FROM events WHERE event='page_view' ORDER BY created_at DESC LIMIT 50",
      "SELECT date(created_at) as day,COUNT(*) as views FROM events WHERE event='page_view' AND created_at>=datetime('now','-30 days') GROUP BY day ORDER BY day",
      "SELECT COUNT(*) as n FROM events WHERE event='video_play'",
      `SELECT label, COUNT(*) as total_plays, COUNT(DISTINCT ip) as unique_viewers, MAX(created_at) as last_played,
        SUM(CASE WHEN created_at>=datetime('now','-7 days') THEN 1 ELSE 0 END) as plays_week,
        SUM(CASE WHEN created_at>=datetime('now','-30 days') THEN 1 ELSE 0 END) as plays_month
        FROM events WHERE event='video_play' GROUP BY label ORDER BY total_plays DESC`,
      "SELECT date(created_at) as day,COUNT(*) as plays FROM events WHERE event='video_play' AND created_at>=datetime('now','-30 days') GROUP BY day ORDER BY day",
      "SELECT label,ip,ua,created_at FROM events WHERE event='video_play' ORDER BY created_at DESC LIMIT 30",
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100',
      'SELECT COUNT(*) as n FROM messages WHERE read=0',
    ], 'read')

    res.json({
      pageViews: {
        total: Number(pvTotalR.rows[0].n),
        today: Number(pvTodayR.rows[0].n),
        week: Number(pvWeekR.rows[0].n),
      },
      topPages: topPagesR.rows,
      recentVisitors: recentVisitorsR.rows,
      dailyViews: dailyViewsR.rows,
      totalVideoPlays: Number(totalVideoPlaysR.rows[0].n),
      videoBreakdown: videoBreakdownR.rows,
      dailyVideoPlays: dailyVideoPlaysR.rows,
      recentVideoPlays: recentVideoPlaysR.rows,
      messages: messagesR.rows,
      unreadMessages: Number(unreadR.rows[0].n),
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Admin: Mark message read ───────────────────────
app.post('/api/admin/messages/:id/read', requireAdmin, async (req, res) => {
  try {
    await db.execute({ sql: 'UPDATE messages SET read=1 WHERE id=?', args: [req.params.id] })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Admin: Projects CRUD ──────────────────────────
app.get('/api/admin/projects', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.execute('SELECT * FROM projects ORDER BY order_index ASC, id ASC')
    res.json(rows.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  const { title, subtitle, category, year, description, behance_id, behance_url, external_url, imdb_url, pbs_url, tags, featured, order_index } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const tagsArr = Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean)
  try {
    const result = await db.execute({
      sql: `INSERT INTO projects (title,subtitle,category,year,description,behance_id,behance_url,external_url,imdb_url,pbs_url,tags,featured,order_index)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [title, subtitle||'', category||'VFX', year||new Date().getFullYear(), description||'', behance_id||'', behance_url||'', external_url||'', imdb_url||'', pbs_url||'', JSON.stringify(tagsArr), featured?1:0, order_index||0],
    })
    res.json({ ok: true, id: Number(result.lastInsertRowid) })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const { title, subtitle, category, year, description, behance_id, behance_url, external_url, imdb_url, pbs_url, tags, featured, order_index } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const tagsArr = Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean)
  try {
    await db.execute({
      sql: `UPDATE projects SET title=?,subtitle=?,category=?,year=?,description=?,behance_id=?,behance_url=?,external_url=?,imdb_url=?,pbs_url=?,tags=?,featured=?,order_index=?,updated_at=datetime('now') WHERE id=?`,
      args: [title, subtitle||'', category||'VFX', year||new Date().getFullYear(), description||'', behance_id||'', behance_url||'', external_url||'', imdb_url||'', pbs_url||'', JSON.stringify(tagsArr), featured?1:0, order_index||0, req.params.id],
    })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM projects WHERE id=?', args: [req.params.id] })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Admin: File upload ────────────────────────────
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No valid file. Allowed: PDF, images, video.' })
  res.json({ ok: true, filename: req.file.filename, size: req.file.size, url: `/uploads/${req.file.filename}` })
})

app.get('/api/admin/files', requireAdmin, (req, res) => {
  try {
    const files = readdirSync(UPLOADS_DIR).map(name => {
      const stat = statSync(join(UPLOADS_DIR, name))
      return { name, size: stat.size, modified: stat.mtime, url: `/uploads/${name}` }
    }).sort((a, b) => new Date(b.modified) - new Date(a.modified))
    res.json(files)
  } catch { res.json([]) }
})

app.delete('/api/admin/files/:filename', requireAdmin, (req, res) => {
  const name = req.params.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const fp = join(UPLOADS_DIR, name)
  if (!existsSync(fp)) return res.status(404).json({ error: 'Not found' })
  unlinkSync(fp)
  res.json({ ok: true })
})

// ── Admin HTML + health ────────────────────────────
app.get('/admin', (req, res) => res.sendFile(join(__dirname, 'admin.html')))
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }))

// ── DB Init + Start ────────────────────────────────
async function initDb() {
  await db.execute(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL, label TEXT, ip TEXT, ua TEXT, referrer TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`)
  await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT NOT NULL, company TEXT, service TEXT,
    budget TEXT, message TEXT NOT NULL, ip TEXT, read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`)
  await db.execute(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, subtitle TEXT DEFAULT '', category TEXT DEFAULT 'VFX',
    year INTEGER DEFAULT 2024, description TEXT DEFAULT '',
    behance_id TEXT DEFAULT '', behance_url TEXT DEFAULT '',
    external_url TEXT DEFAULT '', imdb_url TEXT DEFAULT '', pbs_url TEXT DEFAULT '',
    tags TEXT DEFAULT '[]', featured INTEGER DEFAULT 0, order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
  )`)
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_label ON events(label)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_event ON events(event)')

  const { rows } = await db.execute('SELECT COUNT(*) as n FROM projects')
  if (Number(rows[0].n) === 0) {
    const seed = [
      ['VFX Reel 2026','Visual Effects Reel','VFX',2026,'Particle simulation, compositing, CGI integration, and fluid dynamics — compiled from 4 years of VFX work.','218145705','https://www.behance.net/gallery/218145705/VFXReel2026_AkshatGobind','','','','["vfx","reel"]',1,1],
      ['Film Reel 2026','Cinematography & Directing','Film',2026,'Arri Alexa Mini, RED Cameras, multi-camera productions, narrative shorts, and commercial work.','240308603','https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind','','','','["film","reel"]',1,2],
      ['Resurgence — Breakdown','Short Film VFX Breakdown','VFX',2025,'Shot-by-shot VFX breakdown of a short sci-fi film — compositing, particles, CG environment integration.','239924089','https://www.behance.net/gallery/239924089/ResurgenceShortFilm_Breakdown','','https://www.imdb.com/title/tt37960145/','','["vfx","breakdown"]',0,3],
      ['Awakening','Senior Capstone — VFX','VFX',2024,'Houdini particles & Nuke compositing — senior capstone project.','217317013','https://www.behance.net/gallery/217317013/Awakening','','','','["vfx"]',0,4],
      ['Bird Murmuration','Houdini Simulation','Simulation',2024,'Large-scale flocking simulation and water effects built in Houdini using custom VEX expressions.','217317251','https://www.behance.net/gallery/217317251/Bird-Murmuration','','','','["vfx","simulation"]',0,5],
      ["A Dreamer's Journey",'Narrative Short Film','Film',2025,'A visual narrative short film exploring identity, movement, and memory.','239925951','https://www.behance.net/gallery/239925951/A-Dreamers-Journey','','','','["film"]',0,6],
      ['Gatorade — Become Greatness','Commercial Concept','Commercial',2025,'High-energy commercial concept — directed, shot, and edited with practical and digital effects.','239924297','https://www.behance.net/gallery/239924297/Gatorade-Become-Greatness','','','','["film","commercial"]',0,7],
      ['ChefATL — Season 1','Television — Camera Operator','Film',2024,'Camera B operator on PBS series ChefATL — shot on Arri Alexa Mini. Multi-camera live food television production.','','','https://www.pbs.org/show/chefatl/','https://www.imdb.com/title/tt33341737/','https://www.pbs.org/show/chefatl/','["film","tv"]',0,8],
      ['Underworld','Maya Volumetric FX','Simulation',2022,'Maya volumetric fog and atmospheric simulation — environment VFX.','217315571','https://www.behance.net/gallery/217315571/Underworld','','','','["vfx","simulation"]',0,9],
      ['LED Volume','Director & Cinematographer','Film',2022,'Director and cinematographer on an LED volume production.','217315193','https://www.behance.net/gallery/217315193/LED-Volume','','','','["film"]',0,10],
      ['Warped Road','3D Environment','VFX',2022,'3D environment modeling and procedural deformation using VEX.','217314979','https://www.behance.net/gallery/217314979/Warped-Road','','','','["vfx"]',0,11],
      ['The Curse','Short Film','Film',2025,'Short film — cinematography, directing, and post-production.','239923463','https://www.behance.net/gallery/239923463/The-Curse','','','','["film"]',0,12],
      ['RoboButler','Character Animation & Compositing','VFX',2023,'Full character pipeline — modeling, rigging, animation, and compositing.','217314453','https://www.behance.net/gallery/217314453/RoboButler','','','','["vfx","animation"]',0,13],
    ]
    for (const row of seed) {
      await db.execute({
        sql: `INSERT INTO projects (title,subtitle,category,year,description,behance_id,behance_url,external_url,imdb_url,pbs_url,tags,featured,order_index) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: row,
      })
    }
    console.log(`✅ Seeded ${seed.length} projects`)
  }
}

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🎬 Haptic Razs backend`)
      console.log(`   API:    http://localhost:${PORT}/api/health`)
      console.log(`   Admin:  http://localhost:${PORT}/admin\n`)
    })
  })
  .catch(err => {
    console.error('DB init failed:', err)
    process.exit(1)
  })
