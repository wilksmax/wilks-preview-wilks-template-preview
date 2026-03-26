import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import cfg from '../site.config.json'

import Nav          from './components/Nav.jsx'
import Hero         from './components/Hero.jsx'
import Stats        from './components/Stats.jsx'
import Services     from './components/Services.jsx'
import About        from './components/About.jsx'
import Process      from './components/Process.jsx'
import WhyUs        from './components/WhyUs.jsx'
import Gallery      from './components/Gallery.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact      from './components/Contact.jsx'
import Footer       from './components/Footer.jsx'
import ServicePage  from './components/ServicePage.jsx'
import AboutPage    from './components/AboutPage.jsx'
import TeamPage     from './components/TeamPage.jsx'
import CareersPage  from './components/CareersPage.jsx'
import ProjectsPage from './components/ProjectsPage.jsx'

const SECTION_MAP = {
  hero:         <Hero         key="hero"         cfg={cfg} />,
  stats:        <Stats        key="stats"        cfg={cfg} />,
  services:     <Services     key="services"     cfg={cfg} />,
  about:        <About        key="about"        cfg={cfg} />,
  process:      <Process      key="process"      cfg={cfg} />,
  whyUs:        <WhyUs        key="whyUs"        cfg={cfg} />,
  gallery:      <Gallery      key="gallery"      cfg={cfg} />,
  testimonials: <Testimonials key="testimonials" cfg={cfg} />,
  contact:      <Contact      key="contact"      cfg={cfg} />,
}

// Scroll-reveal — re-runs on every route change
function useScrollReveal() {
  const location  = useLocation()
  const animations = cfg.sections?.animations !== false

  useEffect(() => {
    if (!animations) {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => el.classList.add('visible'))
      return
    }
    document.querySelectorAll('.stagger').forEach(container => {
      Array.from(container.children).forEach((child, i) => child.style.setProperty('--i', i))
    })
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
      el.classList.remove('visible'); io.observe(el)
    })
    return () => io.disconnect()
  }, [location.pathname, animations])
}

// Scroll to hash after navigation (e.g. /#contact)
function useHashScroll() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key])
}

function AppInner() {
  useScrollReveal()
  useHashScroll()

  const order = cfg.sections?.order || Object.keys(SECTION_MAP)
  const homeSections = order
    .filter(key => {
      if (['gallery', 'testimonials', 'whyUs'].includes(key)) return cfg[key]?.enabled !== false
      return true
    })
    .map(key => SECTION_MAP[key])
    .filter(Boolean)

  return (
    <>
      <Nav cfg={cfg} />
      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={homeSections} />

          {/* Service pages */}
          <Route path="/services/:slug" element={<ServicePage cfg={cfg} />} />

          {/* About page */}
          {cfg.aboutPage?.enabled && (
            <Route path="/about" element={<AboutPage cfg={cfg} />} />
          )}

          {/* Team page */}
          {cfg.team?.enabled && (
            <Route path="/team" element={<TeamPage cfg={cfg} />} />
          )}

          {/* Careers — page or section mode */}
          {cfg.careers?.enabled && cfg.careers?.mode !== 'section' && (
            <Route path="/careers" element={<CareersPage cfg={cfg} />} />
          )}

          {/* Projects */}
          {cfg.projects?.enabled && (
            <Route path="/projects" element={<ProjectsPage cfg={cfg} />} />
          )}

          {/* Catch-all → home */}
          <Route path="*" element={homeSections} />
        </Routes>
      </main>
      <Footer cfg={cfg} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
