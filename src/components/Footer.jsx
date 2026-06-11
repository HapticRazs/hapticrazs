import './Footer.css'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshat-gobind-796312247' },
  { label: 'Behance', href: 'https://www.behance.net/akshatgobind1' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCjRLETbIg1n0AlGMU5pUCew' },
  { label: 'Instagram', href: 'https://www.instagram.com/artbyhrazs' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img
            src="https://static.wixstatic.com/media/dab4be_d7b3be02f8f44674892ec5b52e7fe661~mv2.png"
            alt="Haptic Razs"
            className="footer__logo"
          />
          <div>
            <p className="footer__name">Haptic Razs</p>
            <p className="footer__tagline">VFX Artist &amp; Filmmaker — SCAD Atlanta</p>
          </div>
        </div>
        <div className="footer__links">
          <p className="footer__links-label">Connect</p>
          <div className="footer__socials">
            {socials.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="footer__social">
                {label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="footer__links">
          <p className="footer__links-label">Pages</p>
          <div className="footer__socials">
            {[['/', 'Home'], ['/work', 'Work'], ['/resume', 'Resume'], ['/about', 'About']].map(([href, label]) => (
              <a key={label} href={href} className="footer__social">{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">&copy;2022 Haptic Razs. All rights reserved.</p>
        <a href="mailto:akshatgobind56@gmail.com" className="footer__email">
          akshatgobind56@gmail.com
        </a>
      </div>
    </footer>
  )
}
