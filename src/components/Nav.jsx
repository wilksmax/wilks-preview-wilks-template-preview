import { useState, useEffect } from 'react'
import './Nav.css'

export default function Nav({ cfg }) {
  const { nav, business } = cfg
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#" className="nav__logo" onClick={close}>
          {business.name}
        </a>

        <nav className={`nav__links${menuOpen ? ' nav__links--open' : ''}`} aria-label="Main navigation">
          {(nav.links || []).map(link => (
            <a key={link.href} href={link.href} className="nav__link" onClick={close}>
              {link.label}
            </a>
          ))}
          {nav.ctaText && (
            <a href={nav.ctaHref} className="btn btn-primary nav__cta" onClick={close}>
              {nav.ctaText}
            </a>
          )}
        </nav>

        <button
          className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
