import { useState, useEffect } from 'react'
import './Contact.css'

const services = [
  { id: 'vfx', label: 'VFX & Simulation', desc: 'Particle systems, fluid sims, compositing, CGI integration' },
  { id: 'film', label: 'Cinematography', desc: 'Camera operation, directing, multi-camera production' },
  { id: 'commercial', label: 'Commercial', desc: 'Concept, production, and post for brand campaigns' },
  { id: 'breakdown', label: 'VFX Breakdown', desc: 'Shot-by-shot breakdowns for film/TV projects' },
  { id: 'collab', label: 'Collaboration', desc: 'Creative partnerships and co-productions' },
  { id: 'other', label: 'Other', desc: 'Tell me about your project' },
]

const socials = [
  { label: 'Email', value: 'akshatgobind56@gmail.com', href: 'mailto:akshatgobind56@gmail.com' },
  { label: 'LinkedIn', value: 'akshat-gobind', href: 'https://www.linkedin.com/in/akshat-gobind-796312247' },
  { label: 'YouTube', value: '@AkshatGobind', href: 'https://www.youtube.com/@AkshatGobind' },
  { label: 'Linktree', value: 'Akshatgobind', href: 'https://linktr.ee/Akshatgobind' },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', service: '', budget: '', message: '',
  })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', label: '/contact' }),
    }).catch(() => {})
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', company: '', service: '', budget: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="contact-page">
      <div className="contact-glow" />

      <div className="page-hero">
        <p className="page-hero__eyebrow">Work Together</p>
        <h1 className="page-hero__title">Hire Me</h1>
        <p className="contact-lead">
          Available for VFX, cinematography, commercial work, and full-time studio positions.
          Let's make something worth watching.
        </p>
      </div>

      <div className="contact-inner">
        <div className="contact-layout">

          {/* Left — form */}
          <div className="contact-form-col">

            {/* Service selector */}
            <div className="contact-services">
              <p className="contact-section-label">What do you need?</p>
              <div className="services-grid">
                {services.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`service-card${form.service === s.id ? ' active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, service: s.id }))}
                  >
                    <p className="service-card__title">{s.label}</p>
                    <p className="service-card__desc">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact form */}
            {status === 'sent' ? (
              <div className="contact-success">
                <div className="contact-success__icon">✓</div>
                <h3>Message received.</h3>
                <p>I'll get back to you within 24–48 hours at {form.email || 'your email'}.</p>
                <button className="btn btn--ghost" onClick={() => setStatus(null)}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <p className="contact-section-label">Your details</p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company / Studio</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Optional"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                      <option value="">Select range</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-5k">$1,000 – $5,000</option>
                      <option value="5k-15k">$5,000 – $15,000</option>
                      <option value="15k-plus">$15,000+</option>
                      <option value="full-time">Full-time position</option>
                      <option value="tbd">To be discussed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project — timeline, deliverables, vision..."
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn--primary contact-submit${status === 'sending' ? ' sending' : ''}`}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>

                {status === 'error' && (
                  <p className="contact-error">
                    Something went wrong. Email me directly at{' '}
                    <a href="mailto:akshatgobind56@gmail.com">akshatgobind56@gmail.com</a>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Right — info */}
          <aside className="contact-info">
            <div className="contact-info-card">
              <p className="contact-section-label">Quick contact</p>
              {socials.map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? '_self' : '_blank'} rel="noreferrer" className="contact-social-row">
                  <span className="contact-social-label">{s.label}</span>
                  <span className="contact-social-value">{s.value} ↗</span>
                </a>
              ))}
            </div>

            <div className="contact-info-card">
              <p className="contact-section-label">Download Resume</p>
              <a href="/VFXResume2026_AkshatGobind.pdf" download className="contact-resume-link">
                <span>VFX Resume 2026</span>
                <span>↓ PDF</span>
              </a>
              <a href="/FilmResume2026_AkshatGobind.pdf" download className="contact-resume-link">
                <span>Film Resume 2026</span>
                <span>↓ PDF</span>
              </a>
            </div>

            <div className="contact-info-card">
              <p className="contact-section-label">Availability</p>
              <p className="contact-avail">
                Open to freelance projects, studio collaborations, and full-time VFX/film positions.
              </p>
              <p className="contact-avail-detail">
                Response time: 24–48 hours
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
