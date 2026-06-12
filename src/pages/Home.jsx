import { useEffect, useRef, useState } from 'react'
import './Home.css'

const projects = [
  {
    id: 'film-reel',
    title: 'Film Reel 2026',
    subtitle: 'Cinematography & Directing',
    behanceId: '240308603',
    behanceUrl: 'https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind',
    desc: 'Arri Alexa Mini, RED cameras, multi-camera productions and commercial work.',
    tag: 'Film',
  },
  {
    id: 'resurgence',
    title: 'Resurgence — Breakdown',
    subtitle: 'Short Film VFX',
    behanceId: '239924089',
    behanceUrl: 'https://www.behance.net/gallery/239924089/ResurgenceShortFilm_Breakdown',
    desc: 'VFX breakdown of a short sci-fi film — particles, compositing, CGI integration.',
    tag: 'VFX',
  },
  {
    id: 'bird',
    title: 'Bird Murmuration',
    subtitle: 'Houdini Simulation',
    behanceId: '217317251',
    behanceUrl: 'https://www.behance.net/gallery/217317251/Bird-Murmuration',
    desc: 'Large-scale particle simulation and water effects built in Houdini.',
    tag: 'Simulation',
  },
  {
    id: 'gatorade',
    title: 'Gatorade — Become Greatness',
    subtitle: 'Commercial',
    behanceId: '239924297',
    behanceUrl: 'https://www.behance.net/gallery/239924297/Gatorade-Become-Greatness',
    desc: 'High-energy commercial concept — shot, directed, and edited.',
    tag: 'Commercial',
  },
  {
    id: 'dreamers',
    title: "A Dreamer's Journey",
    subtitle: 'Narrative Film',
    behanceId: '239925951',
    behanceUrl: 'https://www.behance.net/gallery/239925951/A-Dreamers-Journey',
    desc: 'A visual narrative short film exploring movement and identity.',
    tag: 'Film',
  },
  {
    id: 'awakening',
    title: 'Awakening',
    subtitle: 'Senior Capstone — VFX',
    behanceId: '217317013',
    behanceUrl: 'https://www.behance.net/gallery/217317013/Awakening',
    desc: 'Houdini particles & Nuke compositing — senior capstone project.',
    tag: 'VFX',
  },
]

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '10+', label: 'Projects' },
  { value: 'BFA', label: 'VFX · SCAD' },
  { value: '∞', label: 'Frames Rendered' },
]

const tools = [
  'Houdini', 'Nuke', 'Maya', 'Blender', 'After Effects',
  'Substance Painter', 'Arri Alexa Mini', 'RED Cameras',
  'Blackmagic 6K', 'Python', 'Particle Simulation', 'Compositing',
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
  const trackPlay = () => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'video_play', label: project.title }),
    }).catch(() => {})
  }

  return (
    <FadeIn delay={delay} className="reel-card-wrap">
      <a href={project.behanceUrl} target="_blank" rel="noreferrer" className="reel-card" onClick={trackPlay}>
        <div className="reel-card__embed">
          <iframe
            src={`https://www.behance.net/embed/project/${project.behanceId}?ilo0=1`}
            title={project.title}
            allowFullScreen
            allow="fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
          <div className="reel-card__hover-overlay">
            <div className="reel-card__play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
        <div className="reel-card__info">
          <span className="reel-card__tag">{project.tag}</span>
          <h3 className="reel-card__title">{project.title}</h3>
          <p className="reel-card__desc">{project.desc}</p>
          <span className="reel-card__cta">View on Behance →</span>
        </div>
        <div className="reel-card__border-glow" />
      </a>
    </FadeIn>
  )
}

export default function Home() {
  const [heroIn, setHeroIn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 400)
    // Track home page visit
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

      {/* ── Fullscreen Demo Reel Hero ── */}
      <section className="hero">
        <div className="hero__reel-wrap">
          <iframe
            src="https://www.behance.net/embed/project/218145705?ilo0=1"
            title="VFX Demo Reel 2026 — Haptic Razs"
            allowFullScreen
            allow="fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="hero__iframe"
          />
          <div className="hero__vignette" />
        </div>

        <div className={`hero__content${heroIn ? ' hero__content--in' : ''}`}>
          <div className="hero__left">
            <p className="hero__eyebrow">VFX Demo Reel · 2026</p>
            <h1 className="hero__name">
              Haptic<br />
              <em>Razs</em>
            </h1>
          </div>
          <div className="hero__right">
            <div className="hero__reel-label">
              <p className="hero__reel-title">VFX Demo<br/>Reel 2026</p>
              <p className="hero__reel-sub">Particle Simulation · Compositing · CGI</p>
            </div>
            <div className="hero__meta">
              <p className="hero__role">VFX Artist &amp; Filmmaker</p>
              <p className="hero__byline">Akshat Gobind · SCAD · Class of 2026</p>
            </div>
            <div className="hero__actions">
              <a href="/work" className="btn btn--primary">View All Work</a>
              <a href="/contact" className="btn btn--ghost">Hire Me</a>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span className="hero__scroll-line" />
          <p className="hero__scroll-label">Scroll</p>
        </div>
      </section>

      {/* ── Marquee Strip ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...tools, ...tools].map((t, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 90}>
              <div className="stat">
                <span className="stat__value gradient-text">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            </FadeIn>
          ))}
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
              <a
                href="https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind"
                target="_blank"
                rel="noreferrer"
                className="btn btn--ghost"
              >
                Behance ↗
              </a>
            </div>
          </FadeIn>

          <FadeIn>
            <a
              href="https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind"
              target="_blank"
              rel="noreferrer"
              className="featured-reel"
              onClick={trackFeaturedPlay}
            >
              <div className="featured-reel__embed">
                <iframe
                  src="https://www.behance.net/embed/project/240308603?ilo0=1"
                  title="Film Reel 2026 — Haptic Razs"
                  allowFullScreen
                  allow="fullscreen; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                />
                <div className="featured-reel__overlay" />
              </div>
              <div className="featured-reel__meta">
                <div>
                  <span className="featured-reel__tag">Cinematography & Directing</span>
                  <p className="featured-reel__desc">
                    Four years of camera work across Arri Alexa Mini, RED, and Blackmagic productions —
                    narrative shorts, reality TV, and commercial concept shoots.
                  </p>
                </div>
                <span className="featured-reel__link">View on Behance →</span>
              </div>
            </a>
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
              <a href="https://www.behance.net/akshatgobind1" target="_blank" rel="noreferrer" className="btn btn--ghost">
                Behance ↗
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
