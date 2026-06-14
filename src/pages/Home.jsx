import { useEffect, useRef, useState } from 'react'
import './Home.css'

const projects = [
  {
    id: 'film-reel',
    title: 'Film Reel 2026',
    subtitle: 'Cinematography & Directing',
    youtubeId: 'GClqI5ddfMs',
    youtubeUrl: 'https://youtu.be/GClqI5ddfMs',
    desc: 'Arri Alexa Mini, RED cameras, multi-camera productions and commercial work.',
    tag: 'Film',
  },
  {
    id: 'resurgence',
    title: 'Resurgence — Breakdown',
    subtitle: 'Short Film VFX',
    youtubeId: 'qJoO3b8RbuU',
    youtubeUrl: 'https://youtu.be/qJoO3b8RbuU',
    desc: 'VFX breakdown of a short sci-fi film — particles, compositing, CGI integration.',
    tag: 'VFX',
  },
  {
    id: 'bird',
    title: 'Bird Murmuration',
    subtitle: 'Houdini Simulation',
    youtubeId: '4SCddF-dn30',
    youtubeUrl: 'https://youtu.be/4SCddF-dn30',
    desc: 'Large-scale particle simulation and water effects built in Houdini.',
    tag: 'Simulation',
  },
  {
    id: 'gatorade',
    title: 'Gatorade — Become Greatness',
    subtitle: 'Commercial',
    youtubeId: 'ntWgA5TaGOg',
    youtubeUrl: 'https://youtu.be/ntWgA5TaGOg',
    desc: 'High-energy commercial concept — shot, directed, and edited.',
    tag: 'Commercial',
  },
  {
    id: 'dreamers',
    title: "A Dreamer's Journey",
    subtitle: 'Narrative Film',
    youtubeId: '5Aad-lyNx8Y',
    youtubeUrl: 'https://youtu.be/5Aad-lyNx8Y',
    desc: 'A visual narrative short film exploring movement and identity.',
    tag: 'Film',
  },
  {
    id: 'awakening',
    title: 'Awakening',
    subtitle: 'Senior Capstone — VFX',
    youtubeId: 'KkFFgawtzpQ',
    youtubeUrl: 'https://youtu.be/KkFFgawtzpQ',
    desc: 'Houdini particles & Nuke compositing — senior capstone project.',
    tag: 'VFX',
  },
]

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])
  return (
    <div ref={ref} className={`fade-in ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function ReelCard({ project, delay = 0 }) {
  const [active, setActive] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${project.youtubeId}/mqdefault.jpg`

  const trackPlay = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'video_play', label: project.title }),
    }).catch(() => {})
  }

  return (
    <FadeIn delay={delay} className="reel-card-wrap">
      <div className="reel-card">
        <div className="reel-card__embed">
          {active ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={project.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          ) : (
            <div
              className="reel-card__thumb"
              style={{ backgroundImage: `url(${thumb})` }}
              onClick={() => { setActive(true); trackPlay() }}
            >
              <div className="reel-card__hover-overlay">
                <div className="reel-card__play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="reel-card__info">
          <span className="reel-card__tag">{project.tag}</span>
          <h3 className="reel-card__title">{project.title}</h3>
          <p className="reel-card__desc">{project.desc}</p>
          <a href={project.youtubeUrl} target="_blank" rel="noreferrer" className="reel-card__cta">
            Watch on YouTube →
          </a>
        </div>
        <div className="reel-card__border-glow" />
      </div>
    </FadeIn>
  )
}

const REELS = {
  vfx:  { id: 'juik4TNmWLg', label: 'VFX Reel 2026',  url: 'https://youtu.be/juik4TNmWLg' },
  film: { id: 'GClqI5ddfMs', label: 'Film Reel 2026', url: 'https://youtu.be/GClqI5ddfMs' },
}

export default function Home() {
  const [heroIn, setHeroIn] = useState(false)
  const [reelTrack, setReelTrack] = useState('vfx')
  const [featuredActive, setFeaturedActive] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 200)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', label: '/' }),
    }).catch(() => {})
    return () => clearTimeout(t)
  }, [])

  const trackFeaturedPlay = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'video_play', label: 'Film Reel 2026 (Featured)' }),
    }).catch(() => {})
  }

  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className={`hero__text${heroIn ? ' hero__text--in' : ''}`}>
          <p className="hero__eyebrow">Akshat Gobind · SCAD 2026</p>
          <h1 className="hero__title">VFX Artist &amp; Filmmaker</h1>
          <p className="hero__sub">VFX Supervisor · Compositor · Director · Cinematographer</p>
          <div className="hero__actions">
            <a href="/work" className="btn btn--primary">View All Work</a>
            <a href="/contact" className="btn btn--ghost">Hire Me</a>
          </div>
        </div>

        <div className={`hero__player${heroIn ? ' hero__player--in' : ''}`}>
          <div className="hero__player-header">
            <div className="hero__reel-toggle">
              {Object.entries(REELS).map(([key, reel]) => (
                <button
                  key={key}
                  className={`hero__reel-btn${reelTrack === key ? ' hero__reel-btn--active' : ''}`}
                  onClick={() => setReelTrack(key)}
                >
                  {reel.label}
                </button>
              ))}
            </div>
            <a href={REELS[reelTrack].url} target="_blank" rel="noreferrer" className="hero__yt-link">
              YouTube ↗
            </a>
          </div>
          <div className="hero__player-frame" key={reelTrack}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${REELS[reelTrack].id}?rel=0&modestbranding=1`}
              title={`${REELS[reelTrack].label} — Haptic Razs`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Reel: Film Reel 2026 ── */}
      <section className="featured-section">
        <div className="featured-inner">
          <FadeIn>
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Featured</p>
                <h2 className="section-title">Film Reel 2026</h2>
              </div>
              <div className="section-line" />
              <a href="https://youtu.be/GClqI5ddfMs" target="_blank" rel="noreferrer" className="btn btn--ghost">
                YouTube ↗
              </a>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="featured-reel">
              <div className="featured-reel__embed">
                {featuredActive ? (
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/GClqI5ddfMs?autoplay=1&rel=0&modestbranding=1"
                    title="Film Reel 2026 — Haptic Razs"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  />
                ) : (
                  <div
                    className="featured-reel__thumb"
                    style={{ backgroundImage: 'url(https://i.ytimg.com/vi/GClqI5ddfMs/maxresdefault.jpg)' }}
                    onClick={() => { setFeaturedActive(true); trackFeaturedPlay() }}
                  >
                    <div className="featured-reel__overlay" />
                    <div className="featured-reel__play">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="featured-reel__meta">
                <div>
                  <span className="featured-reel__tag">Cinematography & Directing</span>
                  <p className="featured-reel__desc">
                    Four years of camera work across Arri Alexa Mini, RED, and Blackmagic productions —
                    narrative shorts, reality TV, and commercial concept shoots.
                  </p>
                </div>
                <a href="https://youtu.be/GClqI5ddfMs" target="_blank" rel="noreferrer" className="featured-reel__link">
                  Watch on YouTube →
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="projects-section">
        <div className="projects-inner">
          <FadeIn>
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Selected Work</p>
                <h2 className="section-title">Projects &amp; Breakdowns</h2>
              </div>
              <div className="section-line" />
            </div>
          </FadeIn>

          <div className="reels-grid">
            {projects.map((project, i) => (
              <ReelCard key={project.id} project={project} delay={i * 70} />
            ))}
          </div>

          <FadeIn>
            <div className="projects-cta">
              <p>Full portfolio on</p>
              <a href="https://www.youtube.com/@AkshatGobind" target="_blank" rel="noreferrer" className="btn btn--ghost">
                YouTube ↗
              </a>
              <a href="https://linktr.ee/Akshatgobind" target="_blank" rel="noreferrer" className="btn btn--ghost">
                Linktree ↗
              </a>
              <a href="/work" className="btn btn--outline">All Projects</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <FadeIn>
          <div className="cta-inner">
            <p className="section-eyebrow">Open to Opportunities</p>
            <h2 className="cta-title">
              Let's create something<br />
              <span className="gradient-text">extraordinary.</span>
            </h2>
            <p className="cta-sub">
              Available for VFX work, film productions, and full-time studio positions.
            </p>
            <div className="cta-actions">
              <a href="/contact" className="btn btn--primary">Hire Me</a>
              <a href="mailto:akshatgobind56@gmail.com" className="btn btn--ghost">Email Directly ↗</a>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}
