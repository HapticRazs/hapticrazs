import './About.css'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshat-gobind-796312247' },
  { label: 'Behance', href: 'https://www.behance.net/akshatgobind1' },
  { label: 'Linktree', href: 'https://linktr.ee/Akshatgobind' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCjRLETbIg1n0AlGMU5pUCew' },
  { label: 'Instagram', href: 'https://www.instagram.com/artbyhrazs' },
]

const cards = [
  { label: 'Status', value: 'BFA Visual Effects — Graduated 2026' },
  { label: 'School', value: 'Savannah College of Art and Design' },
  { label: 'Specialization', value: 'Particle Simulation & Compositing' },
  { label: 'Camera', value: 'Arri Alexa Mini · RED · Blackmagic 6K' },
  { label: 'Available For', value: 'Freelance, Studio Positions & Collaborations' },
]

export default function About() {
  return (
    <main className="about-page">

      <div className="page-hero">
        <p className="page-hero__eyebrow">The Artist</p>
        <h1 className="page-hero__title">About</h1>
      </div>

      <div className="about-inner">
        <div className="about-layout">

          {/* Text column */}
          <div className="about-text">

            {/* Profile photo */}
            <div className="about-photo-wrap">
              <img
                src="https://static.wixstatic.com/media/dab4be_4dad3156fbcd414f8559c3f425a99edb~mv2.jpg"
                alt="Akshat Gobind — Haptic Razs"
                className="about-photo"
              />
              <div className="about-photo-glow" />
            </div>

            <p className="about-lead">
              I'm Akshat Gobind — a visual effects artist and filmmaker. I graduated with a
              BFA in Visual Effects from the Savannah College of Art and Design (SCAD), Class of 2026.
            </p>
            <p>
              Passionate about health, technology, and filmmaking, I aim to master VFX creation
              for film and television. I describe myself as resilient and adaptable —
              someone who thrives under pressure and stays focused on long-term goals.
            </p>
            <p>
              My approach to work emphasizes continuous learning and growth. I seek to contribute
              to storytelling projects that push creative boundaries — collaborating with teams
              producing impactful narratives across film, commercial, and television.
            </p>
            <p>
              My technical work spans particle simulation, compositing, camera operation,
              and 3D modeling. Whether it's a Houdini fluid sim or operating an Arri Alexa Mini
              on a live production, I bring the same focus and intent to every frame.
            </p>

            {/* Contact block */}
            <div className="about-contact">
              <h2 className="about-contact__title">Get in touch</h2>
              <a href="mailto:akshatgobind56@gmail.com" className="about-contact__email">
                akshatgobind56@gmail.com
              </a>
              <div className="about-socials">
                {socials.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="about-social">
                    {label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="about-sidebar">
            {cards.map(({ label, value }) => (
              <div key={label} className="about-card">
                <p className="about-card__label">{label}</p>
                <p className="about-card__value">{value}</p>
              </div>
            ))}
            <div className="about-resumes">
              <p className="about-card__label" style={{ marginBottom: '0.75rem' }}>Download Resume</p>
              <a href="/VFXResume2026_AkshatGobind.pdf" download className="btn btn--outline about-resume-btn">
                VFX Resume ↓
              </a>
              <a href="/FilmResume2026_AkshatGobind.pdf" download className="btn btn--ghost about-resume-btn">
                Film Resume ↓
              </a>
            </div>
            <a href="/contact" className="btn btn--primary about-hire-btn">
              Hire Me →
            </a>
          </aside>

        </div>
      </div>
    </main>
  )
}
