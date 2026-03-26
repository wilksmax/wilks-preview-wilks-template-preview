import { useEffect } from 'react'
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

export default function App() {
  const order      = cfg.sections?.order || Object.keys(SECTION_MAP)
  const animations = cfg.sections?.animations !== false

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    if (!animations) {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => el.classList.add('visible'))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    // Assign stagger index to stagger children
    document.querySelectorAll('.stagger').forEach(container => {
      Array.from(container.children).forEach((child, i) => {
        child.style.setProperty('--i', i)
      })
    })

    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [animations])

  const sections = order
    .filter(key => {
      // Skip disabled optional sections
      if (['gallery', 'testimonials', 'whyUs'].includes(key)) {
        return cfg[key]?.enabled !== false
      }
      return true
    })
    .map(key => SECTION_MAP[key])
    .filter(Boolean)

  return (
    <>
      <Nav cfg={cfg} />
      <main>{sections}</main>
      <Footer cfg={cfg} />
    </>
  )
}
