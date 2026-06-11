import './Resume.css'

const experience = [
  { year: '2024–2025', title: 'SCADfit Leadership & Intramural Assistance', org: 'SCAD Atlanta' },
  { year: '2024', title: 'Bird Murmuration', org: 'Houdini particle & water simulation' },
  { year: '2024', title: 'Awakening', org: 'Houdini particles & Nuke compositing — senior capstone' },
  { year: '2023', title: 'Wave Machine', org: '3D modeling with VEX expressions' },
  { year: '2023', title: 'ChefATL (Season 1)', org: 'Camera B operator — Arri Alexa Mini' },
  { year: '2023', title: 'Fly on the Wall', org: 'Multi-camera reality TV production' },
  { year: '2022', title: 'Underworld', org: 'Maya volumetric fog simulation' },
  { year: '2022', title: 'Warped Road', org: '3D environment modeling' },
  { year: '2022', title: 'LED Volume', org: 'Director & cinematographer' },
  { year: '2022', title: 'RoboButler', org: 'Modeling, animation, and compositing' },
  { year: '2022', title: 'Burning Head Effect', org: 'Custom Blender shader work' },
]

const education = [
  {
    degree: 'BFA in Visual Effects',
    school: 'Savannah College of Art and Design',
    period: '2022 – Present',
    note: 'Senior',
  },
  {
    degree: 'Senior Secondary Certificate',
    school: 'Carmel Senior Secondary School, India',
    period: '2019 – 2021',
  },
]

const software = [
  'Houdini', 'Autodesk Maya', 'Blender', 'Nuke', 'Substance Painter',
  'After Effects', 'Photoshop', 'Illustrator',
]

const hardware = [
  'Arri Alexa Mini', 'RED Cameras', 'Blackmagic Pocket 6K', 'Sony A74',
  'HMI Lighting', 'Nanlite',
]

const specializations = [
  'Particle Simulation', 'Water Simulation', 'Compositing',
  'Cloth Simulation', 'Custom Scripts', 'Python', 'HTML',
]

export default function Resume() {
  return (
    <main className="resume">
      <div className="resume__inner">
        <div className="page-hero">
          <p className="page-hero__eyebrow">Experience &amp; Skills</p>
          <h1 className="page-hero__title">Resume</h1>
        </div>

        <div className="resume__layout">
          <div className="resume__main">
            <section className="resume__section">
              <div className="section-header">
                <h2 className="section-title">Experience</h2>
                <div className="section-line" />
              </div>
              <div className="timeline">
                {experience.map((item, i) => (
                  <div key={i} className="timeline__item">
                    <div className="timeline__year">{item.year}</div>
                    <div className="timeline__body">
                      <h3 className="timeline__title">{item.title}</h3>
                      <p className="timeline__org">{item.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="resume__section">
              <div className="section-header">
                <h2 className="section-title">Education</h2>
                <div className="section-line" />
              </div>
              {education.map((edu, i) => (
                <div key={i} className="edu-card">
                  <div className="edu-card__period">{edu.period}</div>
                  <h3 className="edu-card__degree">{edu.degree}</h3>
                  <p className="edu-card__school">{edu.school}{edu.note ? ` — ${edu.note}` : ''}</p>
                </div>
              ))}
            </section>
          </div>

          <aside className="resume__sidebar">
            <section className="resume__section">
              <h2 className="sidebar-title">Software</h2>
              <ul className="skill-list">
                {software.map(s => <li key={s}>{s}</li>)}
              </ul>
            </section>
            <section className="resume__section">
              <h2 className="sidebar-title">Hardware</h2>
              <ul className="skill-list">
                {hardware.map(h => <li key={h}>{h}</li>)}
              </ul>
            </section>
            <section className="resume__section">
              <h2 className="sidebar-title">Specializations</h2>
              <ul className="skill-list">
                {specializations.map(s => <li key={s}>{s}</li>)}
              </ul>
            </section>
            <section className="resume__section">
              <h2 className="sidebar-title">Contact</h2>
              <ul className="skill-list">
                <li><a href="mailto:akshatgobind56@gmail.com">akshatgobind56@gmail.com</a></li>
                <li>
                  <a href="https://www.linkedin.com/in/akshat-gobind-796312247" target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://www.behance.net/akshatgobind1" target="_blank" rel="noreferrer">
                    Behance
                  </a>
                </li>
              </ul>
            </section>
            <a
              href="/Akshat_Gobind_ShotSheet.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost sidebar-btn"
            >
              Download Shot Sheet
            </a>
          </aside>
        </div>
      </div>
    </main>
  )
}
