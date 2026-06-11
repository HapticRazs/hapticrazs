import { useEffect, useRef } from 'react'
import './Home.css'

const projects = [
  {
    id: 'film-reel',
    title: 'Film Reel 2026',
    subtitle: 'Cinematography & Directing',
    behanceId: '240308603',
    behanceUrl: 'https://www.behance.net/gallery/240308603/FilmReel2026_AkshatGobind',
    desc: 'Arri Alexa Mini, RED cameras, and multi-camera productions',
  },
  {
    id: 'vfx-reel',
    title: 'VFX Reel 2026',
    subtitle: 'Visual Effects',
    behanceId: '218145705',
    behanceUrl: 'https://www.behance.net/gallery/218145705/VFXReel2026_AkshatGobind',
    desc: 'Particle simulation, compositing, and CGI integration',
  },
  {
    id: 'resurgence',
    title: 'Resurgence — Breakdown',
    subtitle: 'Short Film VFX',
    behanceId: '239924089',
    behanceUrl: 'https://www.behance.net/gallery/239924089/ResurgenceShortFilm_Breakdown',
    desc: 'A VFX breakdown of a short sci-fi film',
  },
  {
    id: 'dreamers',
    title: "A Dreamer's Journey",
    subtitle: 'Film',
    behanceId: '239925951',
    behanceUrl: 'https://www.behance.net/gallery/239925951/A-Dreamers-Journey',
    desc: 'A narrative short film project',
  },
  {
    id: 'gatorade',
    title: 'Gatorade — Become Greatness',
    subtitle: 'Commercial',
    behanceId: '239924297',
    behanceUrl: 'https://www.behance.net/gallery/239924297/Gatorade-Become-Greatness',
    desc: 'Commercial concept production',
  },
  {
    id: 'bird',
    title: 'Bird Murmuration',
    subtitle: 'Houdini Simulation',
    behanceId: '217317251',
    behanceUrl: 'https://www.behance.net/gallery/217317251/Bird-Murmuration',
    desc: 'Particle and water simulation in Houdini',
  },
]

const stats = [
  { value: '4+', label: 'Years of Experience' },
  { value: '10+', label: 'Projects Completed' },
  { value: 'BFA', label: 'Visual Effects, SCAD' },
  { value: '∞', label: 'Frames Rendered' },
]

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
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

export default function Home() {
  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-glow" />
        <div className="hero__content">
          <div className="hero__logo-wrap">
            <img
              src="https://static.wixstatic.com/media/dab4be_d7b3be02f8f44674892ec5b52e7fe661~mv2.png"
              alt="Haptic Razs"
              className="hero__logo"
            />
          </div>
          <p className="hero__eyebrow">VFX Artist &amp; Filmmaker</p>
          <h1 className="hero__title">
            <span>Haptic</span>
            <span className="gradient-text"> Razs</span>
          </h1>
          <p className="hero__name">Akshat Gobind</p>
          <p className="hero__sub">
            Crafting visual worlds through particle simulation, compositing, and
            cinematography — currently a senior at SCAD Atlanta.
          </p>
          <div className="hero__cta">
            <a href="/work" className="btn btn--primary">View Work</a>
            <a
              href="https://www.hapticrazs.com/_files/ugd/dab4be_9ad29b98070a441891fbcb509cbf2e38.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost"
            >
              Shot Sheet ↗
            </a>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span className="hero__scroll-line" />
          <span className="hero__scroll-label">Scroll</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="stats__inner">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80}>
              <div className="stat">
                <span className="stat__value gradient-text">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="reels" id="work">
        <div className="reels__inner">
          <FadeIn>
            <p className="section-eyebrow">Selected Work</p>
            <div className="section-header">
              <h2 className="section-title">Projects &amp; Reels</h2>
              <div className="section-line" />
            </div>
          </FadeIn>

          <div className="reels__grid">
            {projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 80} className="reel-card-wrap">
                <a
                  href={project.behanceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="reel-card"
                >
                  <div className="reel-card__embed">
                    <iframe
                      src={`https://www.behance.net/embed/project/${project.behanceId}?ilo0=1`}
                      title={project.title}
                      allowFullScreen
                      allow="clipboard-write"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    <div className="reel-card__overlay" />
                    <div className="reel-card__view-btn">View on Behance ↗</div>
                  </div>
                  <div className="reel-card__info">
                    <p className="reel-card__subtitle">{project.subtitle}</p>
                    <h3 className="reel-card__title">{project.title}</h3>
                    <p className="reel-card__desc">{project.desc}</p>
                  </div>
                  <div className="reel-card__border" />
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="behance-cta">
              <p>See all projects on</p>
              <a
                href="https://www.behance.net/akshatgobind1"
                target="_blank"
                rel="noreferrer"
                className="btn btn--ghost"
              >
                Behance ↗
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Tools Strip ── */}
      <section className="tools">
        <div className="tools__inner">
          <p className="tools__label">Tools &amp; Software</p>
          <div className="tools__list">
            {['Houdini', 'Nuke', 'Maya', 'Blender', 'After Effects', 'Substance Painter', 'Arri Alexa', 'RED'].map(t => (
              <span key={t} className="tools__item">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <FadeIn>
          <div className="cta-banner__inner">
            <h2 className="cta-banner__title">
              Let's create something<br />
              <span className="gradient-text">extraordinary.</span>
            </h2>
            <p className="cta-banner__sub">Open to freelance projects and collaborations.</p>
            <a href="mailto:akshatgobind56@gmail.com" className="btn btn--primary">
              Get in Touch
            </a>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}
