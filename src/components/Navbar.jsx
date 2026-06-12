import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/work', label: 'Work' },
  { to: '/resume', label: 'Resume' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const resumeRef = useRef(null)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false); setResumeOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const handleClick = (e) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target)) {
        setResumeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--open' : ''}`}>
      <NavLink to="/" className="navbar__logo" aria-label="Haptic Razs — Home">
        <img
          src="https://static.wixstatic.com/media/dab4be_d7b3be02f8f44674892ec5b52e7fe661~mv2.png"
          alt="Haptic Razs logo"
          className="navbar__logo-img"
        />
        <span className="navbar__logo-text">Haptic<span>Razs</span></span>
      </NavLink>

      <nav className="navbar__nav" aria-label="Main navigation">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}

        {/* Resume dropdown */}
        <div className="navbar__resume-wrap" ref={resumeRef}>
          <button
            className={`navbar__link navbar__resume-btn${resumeOpen ? ' active' : ''}`}
            onClick={() => setResumeOpen(v => !v)}
            aria-expanded={resumeOpen}
          >
            Download CV <span className={`navbar__chevron${resumeOpen ? ' open' : ''}`}>▾</span>
          </button>
          {resumeOpen && (
            <div className="navbar__resume-dropdown">
              <a href="/VFXResume2026_AkshatGobind.pdf" download className="navbar__resume-item">
                <span className="navbar__resume-icon">⬇</span>
                <div>
                  <p>VFX Resume</p>
                  <span>Visual Effects & Simulation</span>
                </div>
              </a>
              <a href="/FilmResume2026_AkshatGobind.pdf" download className="navbar__resume-item">
                <span className="navbar__resume-icon">⬇</span>
                <div>
                  <p>Film Resume</p>
                  <span>Cinematography & Directing</span>
                </div>
              </a>
            </div>
          )}
        </div>

        <NavLink to="/contact" className="navbar__hire">
          Hire Me
        </NavLink>
      </nav>

      <button
        className={`navbar__burger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      {/* Mobile full-screen menu */}
      <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="navbar__mobile-links">
          <NavLink to="/" className="mobile-link" end>Home</NavLink>
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className="mobile-link">{label}</NavLink>
          ))}
          <NavLink to="/contact" className="mobile-link">Contact</NavLink>
        </div>
        <div className="navbar__mobile-resumes">
          <a href="/VFXResume2026_AkshatGobind.pdf" download className="mobile-resume-link">↓ VFX Resume</a>
          <a href="/FilmResume2026_AkshatGobind.pdf" download className="mobile-resume-link">↓ Film Resume</a>
        </div>
        <div className="navbar__mobile-foot">
          <p>akshatgobind56@gmail.com</p>
          <p>SCAD · BFA VFX · Class of 2026</p>
        </div>
      </div>
    </header>
  )
}
