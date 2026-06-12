import { useEffect, useRef, useState } from 'react'
import './Work.css'

const FALLBACK = [
  { id:1, title:'VFX Reel 2026', subtitle:'Visual Effects Reel', behance_id:'218145705', behance_url:'https://www.behance.net/gallery/218145705/VFXReel2026_AkshatGobind', description:'Particle simulation, compositing, CGI integration, and fluid dynamics — compiled from 4 years of VFX work.', year:2026, tags:['vfx','reel'], imdb_url:'', pbs_url:'', external_url:'' },
  { id:2, title:'Film Reel 2026', subtitle:'Cinematography & Directing', behance_id:'240308603', behance_url:'https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind', description:'Arri Alexa Mini, RED Cameras, multi-camera productions, narrative shorts, and commercial work.', year:2026, tags:['film','reel'], imdb_url:'', pbs_url:'', external_url:'' },
]

const filters = [
  { key: 'all', label: 'All' },
  { key: 'vfx', label: 'VFX' },
  { key: 'film', label: 'Film' },
  { key: 'simulation', label: 'Simulation' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'reel', label: 'Reels' },
]

function normalizeProject(p) {
  return {
    ...p,
    id: p.id,
    behanceId: p.behance_id,
    behanceUrl: p.behance_url,
    externalUrl: p.external_url,
    imdb: p.imdb_url || null,
    pbs: p.pbs_url || null,
    desc: p.description,
    year: String(p.year),
    tags: Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]'),
  }
}

function WorkCard({ project, delay = 0 }) {
  const href = project.behanceUrl || project.externalUrl || '#'

  const trackPlay = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'video_play', label: project.title }),
    }).catch(() => {})
  }

  return (
    <div className="work-card" style={{ animationDelay: `${delay}ms` }}>
      <a href={href} target="_blank" rel="noreferrer" className="work-card__link" onClick={trackPlay}>
        <div className="work-card__embed">
          {project.behanceId ? (
            <iframe
              src={`https://www.behance.net/embed/project/${project.behanceId}?ilo0=1`}
              title={project.title}
              allowFullScreen
              allow="fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            />
          ) : (
            <div className="work-card__no-embed">
              <p className="work-card__no-embed-label">{project.title}</p>
              <p className="work-card__no-embed-sub">View on {project.pbs ? 'PBS' : 'external link'}</p>
            </div>
          )}
          <div className="work-card__embed-overlay">
            <div className="work-card__play">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <span className="work-card__year">{project.year}</span>
          </div>
        </div>
        <div className="work-card__body">
          <div className="work-card__tags">
            {project.tags.map(t => (
              <span key={t} className="work-card__tag">{t}</span>
            ))}
          </div>
          <h3 className="work-card__title">{project.title}</h3>
          <p className="work-card__subtitle">{project.subtitle}</p>
          <p className="work-card__desc">{project.desc}</p>
          <div className="work-card__links">
            {project.behanceUrl && <span className="work-card__ext-link">Behance →</span>}
            {project.imdb && (
              <a href={project.imdb} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="work-card__ext-link">IMDb ↗</a>
            )}
            {project.pbs && (
              <a href={project.pbs} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="work-card__ext-link">PBS ↗</a>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

export default function Work() {
  const [active, setActive] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data.map(normalizeProject)))
      .catch(() => setProjects(FALLBACK.map(normalizeProject)))
      .finally(() => setLoading(false))

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', label: '/work' }),
    }).catch(() => {})
  }, [])

  const visible = active === 'all'
    ? projects
    : projects.filter(p => p.tags.includes(active))

  return (
    <main className="work-page">
      <div className="page-hero">
        <p className="page-hero__eyebrow">Portfolio</p>
        <h1 className="page-hero__title">Work</h1>
        <p className="work-page__lead">
          VFX, cinematography, simulation, and commercial projects spanning 2022–2026.
        </p>
      </div>

      <div className="work-page__inner">
        <div className="filters">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn${active === f.key ? ' active' : ''}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#444' }}>Loading projects...</div>
        ) : (
          <div className="work-grid" key={active}>
            {visible.map((project, i) => (
              <WorkCard key={project.id} project={project} delay={i * 55} />
            ))}
            {!visible.length && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#444' }}>
                No projects in this category yet.
              </div>
            )}
          </div>
        )}

        <div className="work-page__cta">
          <p>More work on</p>
          <a href="https://www.behance.net/akshatgobind1" target="_blank" rel="noreferrer" className="btn btn--ghost">
            Behance ↗
          </a>
          <a href="https://linktr.ee/Akshatgobind" target="_blank" rel="noreferrer" className="btn btn--ghost">
            Linktree ↗
          </a>
        </div>
      </div>
    </main>
  )
}
