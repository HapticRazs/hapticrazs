import './Resume.css'

const experience = [
  { year: '2024–25', title: 'SCADfit Leadership & Intramural Assistance', org: 'SCAD Atlanta', type: 'Leadership' },
  { year: '2025', title: 'Film Reel 2026', org: 'Cinematography, Directing — Arri Alexa Mini, RED', type: 'Film' },
  { year: '2025', title: 'Resurgence — Short Film Breakdown', org: 'VFX compositing & particle effects', type: 'VFX' },
  { year: '2025', title: "A Dreamer's Journey", org: 'Narrative short film — Director & DP', type: 'Film' },
  { year: '2025', title: 'Gatorade — Become Greatness', org: 'Commercial concept — Director & Editor', type: 'Commercial' },
  { year: '2024', title: 'VFX Reel 2026', org: 'Compilation of particle, fluid, and compositing work', type: 'VFX' },
  { year: '2024', title: 'Bird Murmuration', org: 'Houdini particle & water simulation', type: 'Simulation' },
  { year: '2024', title: 'Awakening', org: 'Houdini particles & Nuke compositing — senior capstone', type: 'VFX' },
  { year: '2023', title: 'ChefATL (Season 1)', org: 'Camera B operator — Arri Alexa Mini', type: 'Film' },
  { year: '2023', title: 'Fly on the Wall', org: 'Multi-camera reality TV production', type: 'Film' },
  { year: '2023', title: 'Wave Machine', org: '3D modeling with VEX expressions', type: 'Simulation' },
  { year: '2022', title: 'LED Volume', org: 'Director & cinematographer', type: 'Film' },
  { year: '2022', title: 'RoboButler', org: 'Character modeling, animation & compositing', type: 'VFX' },
  { year: '2022', title: 'Underworld', org: 'Maya volumetric fog simulation', type: 'Simulation' },
  { year: '2022', title: 'Burning Head Effect', org: 'Custom Blender shader & particle work', type: 'VFX' },
]

const education = [
  {
    degree: 'BFA in Visual Effects',
    school: 'Savannah College of Art and Design',
    period: '2022 – 2026',
    note: 'Graduated',
    detail: 'Specializing in particle simulation, compositing, and 3D FX pipelines.',
  },
  {
    degree: 'Senior Secondary Certificate',
    school: 'Carmel Senior Secondary School, India',
    period: '2019 – 2021',
  },
]

const skills = {
  Software: ['Houdini', 'Autodesk Maya', 'Blender', 'Nuke', 'After Effects', 'Substance Painter', 'Photoshop', 'Illustrator'],
  Hardware: ['Arri Alexa Mini', 'RED Cameras', 'Blackmagic Pocket 6K', 'Sony A7 IV', 'HMI Lighting', 'Nanlite'],
  Specializations: ['Particle Simulation', 'Water & Fluid Simulation', 'Compositing', 'Cloth Simulation', 'VEX Scripting', 'Python', '3D Modeling', 'Camera Operation'],
}

const typeColors = {
  VFX: '#e87640',
  Film: '#c03258',
  Simulation: '#5b7fe8',
  Commercial: '#48b89a',
  Leadership: '#888',
}

export default function Resume() {
  return (
    <main className="resume-page">

      <div className="page-hero">
        <p className="page-hero__eyebrow">Experience &amp; Skills</p>
        <h1 className="page-hero__title">Resume</h1>
      </div>

      <div className="resume-inner">
        <div className="resume-layout">

          {/* Main column */}
          <div className="resume-main">

            <section className="resume-section">
              <div className="section-header">
                <h2 className="section-title">Experience</h2>
                <div className="section-line" />
              </div>
              <div className="timeline">
                {experience.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-item__left">
                      <span className="timeline-item__year">{item.year}</span>
                      <span
                        className="timeline-item__type"
                        style={{ color: typeColors[item.type] }}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="timeline-item__right">
                      <h3 className="timeline-item__title">{item.title}</h3>
                      <p className="timeline-item__org">{item.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="resume-section">
              <div className="section-header">
                <h2 className="section-title">Education</h2>
                <div className="section-line" />
              </div>
              {education.map((edu, i) => (
                <div key={i} className="edu-card">
                  <span className="edu-card__period">{edu.period}</span>
                  <h3 className="edu-card__degree">{edu.degree}</h3>
                  <p className="edu-card__school">
                    {edu.school}{edu.note ? ` — ${edu.note}` : ''}
                  </p>
                  {edu.detail && <p className="edu-card__detail">{edu.detail}</p>}
                </div>
              ))}
            </section>

          </div>

          {/* Sidebar */}
          <aside className="resume-sidebar">
            {Object.entries(skills).map(([cat, list]) => (
              <div key={cat} className="skill-group">
                <h3 className="skill-group__title">{cat}</h3>
                <div className="skill-tags">
                  {list.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className="sidebar-contact">
              <h3 className="skill-group__title">Contact</h3>
              <a href="mailto:akshatgobind56@gmail.com" className="sidebar-email">
                akshatgobind56@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/akshat-gobind-796312247" target="_blank" rel="noreferrer" className="sidebar-link">
                LinkedIn ↗
              </a>
              <a href="https://www.behance.net/akshatgobind1" target="_blank" rel="noreferrer" className="sidebar-link">
                Behance ↗
              </a>
            </div>

            <a
              href="/VFXResume2026_AkshatGobind.pdf"
              download
              className="btn btn--primary sidebar-download"
            >
              Download VFX Resume
            </a>
            <a
              href="/FilmResume2026_AkshatGobind.pdf"
              download
              className="btn sidebar-download"
              style={{ marginTop: '0.75rem', display: 'block', textAlign: 'center' }}
            >
              Download Film Resume
            </a>
          </aside>

        </div>
      </div>
    </main>
  )
}
