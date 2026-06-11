import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/resume', label: 'Resume' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <NavLink to="/" className="navbar__logo">
        <img
          src="https://static.wixstatic.com/media/dab4be_d7b3be02f8f44674892ec5b52e7fe661~mv2.png"
          alt="Haptic Razs"
          className="navbar__logo-img"
        />
        <span className="navbar__logo-text">Haptic Razs</span>
      </NavLink>

      <button
        className={`navbar__burger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      <nav className={`navbar__nav${menuOpen ? ' open' : ''}`}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
        <a
          href="https://www.linkedin.com/in/akshat-gobind-796312247"
          target="_blank"
          rel="noreferrer"
          className="navbar__cta"
        >
          Hire Me
        </a>
      </nav>
    </header>
  )
}
