import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { API_BASE } from './api'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Work from './pages/Work'
import Resume from './pages/Resume'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function Analytics() {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/admin') return
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view',
        label: location.pathname,
        referrer: document.referrer,
        ua: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [location.pathname])
  return null
}

function MainLayout() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
