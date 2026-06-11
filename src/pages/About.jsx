import './About.css'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshat-gobind-796312247' },
  { label: 'Behance', href: 'https://www.behance.net/akshatgobind1' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCjRLETbIg1n0AlGMU5pUCew' },
  { label: 'Instagram', href: 'https://www.instagram.com/artbyhrazs' },
]

export default function About() {
  return (
    <main className="about">
      <div className="about__inner">
        <div className="page-hero">
          <p className="page-hero__eyebrow">The Artist</p>
          <h1 className="page-hero__title">About</h1>
        </div>

        <div className="about__layout">
          <div className="about__text">
            <p className="about__lead">
              I'm Akshat Gobind — a visual effects artist and filmmaker based in Atlanta, GA,
              studying BFA Visual Effects at the Savannah College of Art and Design.
            </p>
            <p>
              Passionate about health, technology, and filmmaking, I aim to master VFX creation
              for film and television. I describe myself as a resilient and adaptable individual,
              someone who thrives under pressure and remains focused on long-term goals.
            </p>
            <p>
              My approach to work emphasizes continuous learning and growth. I seek to become a
              skilled visual effects artist while contributing to storytelling projects that push
              creative boundaries — collaborating with teams producing impactful narratives.
            </p>
            <p>
              My technical work spans particle simulation, compositing, camera operation, and
              3D modeling. Whether it's a Houdini fluid sim or operating an Arri Alexa Mini on a
              live production, I bring the same focus and intent to every frame.
            </p>

            <div className="about__contact">
              <h2 className="about__contact-title">Get in touch</h2>
              <a href="mailto:akshatgobind56@gmail.com" className="about__email">
                akshatgobind56@gmail.com
              </a>
              <div className="about__socials">
                {socials.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="about__social">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <aside className="about__sidebar">
            <div className="about__card">
              <p className="about__card-label">Currently</p>
              <p className="about__card-value">Senior, SCAD Atlanta</p>
            </div>
            <div className="about__card">
              <p className="about__card-label">Degree</p>
              <p className="about__card-value">BFA Visual Effects</p>
            </div>
            <div className="about__card">
              <p className="about__card-label">Specialization</p>
              <p className="about__card-value">Particle Simulation & Compositing</p>
            </div>
            <div className="about__card">
              <p className="about__card-label">Available for</p>
              <p className="about__card-value">Freelance & Collaboration</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
