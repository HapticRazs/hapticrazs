import './Footer.css'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshat-gobind-796312247' },
  { label: 'Behance', href: 'https://www.behance.net/akshatgobind1' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCjRLETbIg1n0AlGMU5pUCew' },
  { label: 'Instagram', href: 'https://www.instagram.com/artbyhrazs' },
  { label: 'Linktree', href: 'https://linktr.ee/Akshatgobind' },
]

const nav = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/resume', label: 'Resume' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Hire Me' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__gradient-line" />
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src="https://static.wixstatic.com/media/dab4be_d7b3be02f8f44674892ec5b52e7fe661~mv2.png"
              alt="Haptic Razs"
              className="footer__logo"
            />
            <div>
              <p className="footer__name">Haptic Razs</p>
              <p className="footer__tagline">VFX Artist & Filmmaker · SCAD 2022 – 2026</p>
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <p className="footer__col-label">Pages</p>
              {nav.map(({ href, label }) => (
                <a key={label} href={href} className="footer__link">{label}</a>
              ))}
            </div>
            <div className="footer__col">
              <p className="footer__col-label">Connect</p>
              {socials.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="footer__link">
                  {label} ↗
                </a>
              ))}
            </div>
            <div className="footer__col">
              <p className="footer__col-label">Contact</p>
              <a href="mailto:akshatgobind56@gmail.com" className="footer__link footer__email-link">
                akshatgobind56@gmail.com
              </a>
              <a
                href="/VFXResume2026_AkshatGobind.pdf"
                download
                className="footer__shotsheet"
              >
                Download VFX Resume ↓
              </a>
              <a
                href="/FilmResume2026_AkshatGobind.pdf"
                download
                className="footer__shotsheet"
              >
                Download Film Resume ↓
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">&copy; {new Date().getFullYear()} Haptic Razs. All rights reserved.</p>
          <p className="footer__byline">Built with purpose · Akshat Gobind</p>
        </div>
      </div>
    </footer>
  )
}
