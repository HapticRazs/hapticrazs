import { useEffect, useState } from 'react'
import './Work.css'

const BEHANCE_TO_YT = {
  '218145705': 'juik4TNmWLg',
  '240308603': 'GClqI5ddfMs',
  '239924089': 'qJoO3b8RbuU',
  '217317013': 'KkFFgawtzpQ',
  '217317251': '4SCddF-dn30',
  '239925951': '5Aad-lyNx8Y',
  '239924297': 'ntWgA5TaGOg',
  '239923463': 'QuQ7yt0stjY',
}

const ALL_PROJECTS = [
  {
    id: 1, title: 'VFX Reel 2026', subtitle: 'Visual Effects Reel',
    youtubeId: 'juik4TNmWLg', youtubeUrl: 'https://youtu.be/juik4TNmWLg',
    desc: 'Particle simulation, compositing, CGI integration, and fluid dynamics — compiled from 4 years of VFX work.',
    year: '2026', tags: ['vfx', 'reel'],
  },
  {
    id: 2, title: 'Film Reel 2026', subtitle: 'Cinematography & Directing',
    youtubeId: 'GClqI5ddfMs', youtubeUrl: 'https://youtu.be/GClqI5ddfMs',
    desc: 'Arri Alexa Mini, RED Cameras, multi-camera productions, narrative shorts, and commercial work.',
    year: '2026', tags: ['film', 'reel'],
  },
  {
    id: 20, title: 'ChefATL — Season 1', subtitle: 'Television — Camera B Operator',
    youtubeId: null, youtubeUrl: null,
    desc: 'Emmy Award-winning PBS docuseries — Camera B Operator on episodes 6, 7 & 9, shooting on Arri Alexa Mini.',
    year: '2024–2026', tags: ['film', 'tv'],
    imdb: 'https://www.imdb.com/title/tt33341737/',
    pbs: 'https://www.pbs.org/show/chefatl/',
  },
  {
    id: 3, title: 'Resurgence 2026 | First Fight', subtitle: 'Short Film — VFX & Production',
    youtubeId: 'hlIU8JVD6_U', youtubeUrl: 'https://youtu.be/hlIU8JVD6_U',
    desc: 'Live-action sci-fi action sequence — produced, VFX supervised, and delivered with ~80 VFX shots.',
    year: '2025–2026', tags: ['vfx', 'film'],
  },
  {
    id: 4, title: 'Resurgence — Breakdown', subtitle: 'Short Film VFX Breakdown',
    youtubeId: 'qJoO3b8RbuU', youtubeUrl: 'https://youtu.be/qJoO3b8RbuU',
    desc: 'Shot-by-shot VFX breakdown — actor scans, KeenTools tracking, Nuke compositing, and colorist handoff.',
    year: '2025–2026', tags: ['vfx', 'breakdown'],
  },
  {
    id: 5, title: 'Gatorade — Become Greatness', subtitle: 'Commercial Concept',
    youtubeId: 'ntWgA5TaGOg', youtubeUrl: 'https://youtu.be/ntWgA5TaGOg',
    desc: 'FIFA x Gatorade commercial concept directed in an LED volume — performance, lighting, and post production.',
    year: '2024–2025', tags: ['film', 'commercial'],
  },
  {
    id: 6, title: 'Bird Murmuration', subtitle: 'Houdini Particle & Water Simulation',
    youtubeId: '4SCddF-dn30', youtubeUrl: 'https://youtu.be/4SCddF-dn30',
    desc: 'Large-scale flocking simulation and water effects in Houdini — rendered in Karma.',
    year: '2024–2025', tags: ['vfx', 'simulation'],
  },
  {
    id: 7, title: 'Awakening', subtitle: 'Senior Capstone — VFX',
    youtubeId: 'KkFFgawtzpQ', youtubeUrl: 'https://youtu.be/KkFFgawtzpQ',
    desc: 'Houdini particles & Nuke compositing — senior capstone VFX project.',
    year: '2024', tags: ['vfx'],
  },
  {
    id: 8, title: "A Dreamer's Journey", subtitle: 'Visual Narrative',
    youtubeId: '5Aad-lyNx8Y', youtubeUrl: 'https://youtu.be/5Aad-lyNx8Y',
    desc: 'A visual narrative exploring identity and movement through VFX and cinematography.',
    year: '2025', tags: ['vfx', 'film'],
  },
  {
    id: 9, title: 'Lost Forest', subtitle: 'VFX & Film',
    youtubeId: 'E3MycwlH_xA', youtubeUrl: 'https://youtu.be/E3MycwlH_xA',
    desc: 'Atmospheric VFX and film project blending environment, lighting, and live-action elements.',
    year: '2025', tags: ['vfx', 'film'],
  },
  {
    id: 10, title: 'Wave Machine', subtitle: 'Houdini FX',
    youtubeId: 'QHRriRcfpkY', youtubeUrl: 'https://youtu.be/QHRriRcfpkY',
    desc: 'Kinetic wave sculpture built in Houdini with procedural animation and VEX expressions.',
    year: '2024', tags: ['vfx', 'simulation'],
  },
  {
    id: 11, title: 'Jet Propulsion', subtitle: 'Houdini Pyro Simulation',
    youtubeId: 'SJ91Ruc8WwE', youtubeUrl: 'https://youtu.be/SJ91Ruc8WwE',
    desc: 'Houdini pyro simulation — jet propulsion fire and smoke effects.',
    year: '2025', tags: ['vfx', 'simulation'],
  },
  {
    id: 12, title: 'Cloth Simulation', subtitle: 'Maya nCloth',
    youtubeId: 'HXQ49tZ1-tY', youtubeUrl: 'https://youtu.be/HXQ49tZ1-tY',
    desc: 'Maya nCloth simulation with dynamic fabric behaviour and wind interaction.',
    year: '2025', tags: ['vfx', 'simulation'],
  },
  {
    id: 13, title: 'Green Moss', subtitle: 'Maya Procedural Shader',
    youtubeId: 'hxXL16rxKkw', youtubeUrl: 'https://youtu.be/hxXL16rxKkw',
    desc: 'Procedural moss shader written in Python inside Maya — organic material generation.',
    year: '2025', tags: ['vfx'],
  },
  {
    id: 14, title: 'Old is Gold', subtitle: 'Nuke Compositing',
    youtubeId: 'b7CHqixw8cQ', youtubeUrl: 'https://youtu.be/b7CHqixw8cQ',
    desc: 'Nuke plate compositing — colour grading, integration, and finishing.',
    year: '2024', tags: ['vfx'],
  },
  {
    id: 15, title: 'Satisfying Render', subtitle: 'CG Render',
    youtubeId: 'YroCwORIMFI', youtubeUrl: 'https://youtu.be/YroCwORIMFI',
    desc: 'Procedural 3D render exploring material, shading, and lighting design.',
    year: '2023', tags: ['vfx'],
  },
  {
    id: 16, title: 'The Curse', subtitle: 'Horror Short',
    youtubeId: 'QuQ7yt0stjY', youtubeUrl: 'https://youtu.be/QuQ7yt0stjY',
    desc: 'Short horror film — cinematography, directing, and post-production.',
    year: '2024', tags: ['film'],
  },
  {
    id: 17, title: 'Winner Winner', subtitle: 'Short Film',
    youtubeId: 'Hl4P04q7DMw', youtubeUrl: 'https://youtu.be/Hl4P04q7DMw',
    desc: 'Short film — camera operation and production.',
    year: '2025', tags: ['film'],
  },
  {
    id: 18, title: 'The Ball', subtitle: 'Horror Short',
    youtubeId: 'sYJxnXdEU6A', youtubeUrl: 'https://youtu.be/sYJxnXdEU6A',
    desc: 'Short horror film — cinematography.',
    year: '2024', tags: ['film'],
  },
  {
    id: 19, title: '8 AMs', subtitle: 'Short Film',
    youtubeId: 'VRWAziR-7jg', youtubeUrl: 'https://youtu.be/VRWAziR-7jg',
    desc: 'Short film — camera operation.',
    year: '2023', tags: ['film'],
  },
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
  const youtubeId = p.youtubeId || BEHANCE_TO_YT[p.behance_id] || null
  return {
    ...p,
    youtubeId,
    youtubeUrl: p.youtubeUrl || (youtubeId ? `https://youtu.be/${youtubeId}` : null),
    externalUrl: p.external_url || null,
    imdb: p.imdb || p.imdb_url || null,
    pbs: p.pbs || p.pbs_url || null,
    desc: p.desc || p.description || '',
    year: String(p.year),
    tags: Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]'),
  }
}

function YTThumb({ youtubeId, title }) {
  const [active, setActive] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`

  if (active) {
    return (
      <iframe
        className="work-card__iframe"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    )
  }

  return (
    <div
      className="work-card__thumb"
      style={{ backgroundImage: `url(${thumb})` }}
      onClick={e => { e.preventDefault(); setActive(true) }}
    >
      <div className="work-card__embed-overlay">
        <div className="work-card__play">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function WorkCard({ project, delay = 0 }) {
  const href = project.youtubeUrl || project.externalUrl || '#'

  const trackPlay = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'video_play', label: project.title }),
    }).catch(() => {})
  }

  return (
    <div className="work-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="work-card__link">
        <div className="work-card__embed" onClick={trackPlay}>
          {project.youtubeId ? (
            <YTThumb youtubeId={project.youtubeId} title={project.title} />
          ) : (
            <a href={href} target="_blank" rel="noreferrer" className="work-card__no-embed">
              <p className="work-card__no-embed-label">{project.title}</p>
              <p className="work-card__no-embed-sub">
                {project.pbs ? 'View on PBS' : project.imdb ? 'View on IMDb' : 'View project'}
              </p>
            </a>
          )}
          {project.youtubeId && (
            <span className="work-card__year">{project.year}</span>
          )}
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
            {project.youtubeUrl && (
              <a href={project.youtubeUrl} target="_blank" rel="noreferrer" className="work-card__ext-link">
                YouTube ↗
              </a>
            )}
            {project.imdb && (
              <a href={project.imdb} target="_blank" rel="noreferrer" className="work-card__ext-link">IMDb ↗</a>
            )}
            {project.pbs && (
              <a href={project.pbs} target="_blank" rel="noreferrer" className="work-card__ext-link">PBS ↗</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const [active, setActive] = useState('all')
  const [projects, setProjects] = useState(ALL_PROJECTS.map(normalizeProject))

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setProjects(data.map(normalizeProject))
      })
      .catch(() => {})

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

        <div className="work-page__cta">
          <p>More work on</p>
          <a href="https://www.youtube.com/@AkshatGobind" target="_blank" rel="noreferrer" className="btn btn--ghost">
            YouTube ↗
          </a>
          <a href="https://linktr.ee/Akshatgobind" target="_blank" rel="noreferrer" className="btn btn--ghost">
            Linktree ↗
          </a>
        </div>
      </div>
    </main>
  )
}
