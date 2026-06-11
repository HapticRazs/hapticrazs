import './Work.css'

const categories = [
  {
    id: 'vfx',
    label: 'Visual Effects',
    items: [
      { title: 'Bird Murmuration', desc: 'Houdini particle and water simulation', year: '2024' },
      { title: 'Awakening', desc: 'Houdini particles and Nuke compositing — senior capstone', year: '2024' },
      { title: 'Wave Machine', desc: '3D modeling with VEX expressions', year: '2023' },
      { title: 'Underworld', desc: 'Maya volumetric fog simulation', year: '2023' },
      { title: 'Warped Road', desc: '3D environment modeling', year: '2022' },
      { title: 'Burning Head Effect', desc: 'Custom Blender shader work', year: '2022' },
    ],
  },
  {
    id: 'walkcycle',
    label: 'Walk Cycle',
    items: [
      { title: 'RoboButler', desc: 'Character modeling, animation, and compositing', year: '2023' },
    ],
  },
  {
    id: 'films',
    label: 'Films',
    items: [
      { title: 'ChefATL (Season 1)', desc: 'Camera B operator — Arri Alexa Mini', year: '2024' },
      { title: 'Fly on the Wall', desc: 'Multi-camera reality TV production', year: '2024' },
      { title: 'LED Volume', desc: 'Director & cinematographer', year: '2023' },
    ],
  },
]

export default function Work() {
  return (
    <main className="work">
      <div className="work__inner">
        <div className="page-hero">
          <p className="page-hero__eyebrow">Portfolio</p>
          <h1 className="page-hero__title">Work</h1>
        </div>

        {categories.map((cat) => (
          <section key={cat.id} className="work__section">
            <div className="section-header">
              <h2 className="section-title">{cat.label}</h2>
              <div className="section-line" />
            </div>
            <div className="work__grid">
              {cat.items.map((item) => (
                <div key={item.title} className="work-card">
                  <div className="work-card__year">{item.year}</div>
                  <h3 className="work-card__title">{item.title}</h3>
                  <p className="work-card__desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
