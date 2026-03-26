import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav({ cfg }) {
  const { nav, business, services } = cfg
  const location = useLocation()

  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const dropRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [location])

  const close = () => { setMenuOpen(false); setDropOpen(false) }

  const serviceItems = (services?.items || []).filter(s => s.page?.enabled)
  const showDropdown = nav.showServicesDropdown && serviceItems.length > 0
  const isOnServicePage = location.pathname.startsWith('/services/')

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">

        {/* Logo — always goes home */}
        <Link to="/" className="nav__logo" onClick={close}>
          {business.name}
        </Link>

        <nav className={`nav__links${menuOpen ? ' nav__links--open' : ''}`} aria-label="Main navigation">
          {(nav.links || []).map(link => {
            // Replace the Services link with a dropdown trigger on desktop
            if (link.label === 'Services' && showDropdown) {
              return (
                <div
                  key="services-drop"
                  className={`nav__dropdown-wrap${dropOpen ? ' nav__dropdown-wrap--open' : ''}`}
                  ref={dropRef}
                >
                  <button
                    className={`nav__link nav__dropdown-btn${isOnServicePage ? ' nav__link--active' : ''}`}
                    onClick={() => setDropOpen(o => !o)}
                    aria-expanded={dropOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <span className="nav__drop-arrow" aria-hidden="true">▾</span>
                  </button>

                  <div className="nav__dropdown" role="menu">
                    {/* "All services" anchor link back to home section */}
                    <Link
                      to="/#services"
                      className="nav__dropdown-item nav__dropdown-item--all"
                      role="menuitem"
                      onClick={close}
                    >
                      All Services
                    </Link>
                    <div className="nav__dropdown-divider" />
                    {serviceItems.map(s => (
                      <Link
                        key={s.page.slug}
                        to={`/services/${s.page.slug}`}
                        className={`nav__dropdown-item${location.pathname === `/services/${s.page.slug}` ? ' nav__dropdown-item--active' : ''}`}
                        role="menuitem"
                        onClick={close}
                      >
                        <span className="nav__dropdown-icon">{s.icon}</span>
                        {s.title}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile: show service links inline */}
                  {menuOpen && (
                    <div className="nav__mobile-services">
                      <Link to="/#services" className="nav__mobile-service-all" onClick={close}>
                        All Services
                      </Link>
                      {serviceItems.map(s => (
                        <Link
                          key={s.page.slug}
                          to={`/services/${s.page.slug}`}
                          className="nav__mobile-service-link"
                          onClick={close}
                        >
                          <span>{s.icon}</span> {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            // Regular link — use Link for hash anchors on home, plain <a> otherwise
            const isHashHome = link.href.startsWith('#') || link.href.startsWith('/#')
            const href = link.href.startsWith('#') ? `/${link.href}` : link.href

            return isHashHome ? (
              <Link key={link.href} to={href} className="nav__link" onClick={close}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="nav__link" onClick={close}>
                {link.label}
              </a>
            )
          })}

          {nav.ctaText && (
            <Link to={nav.ctaHref.startsWith('#') ? `/${nav.ctaHref}` : nav.ctaHref} className="btn btn-primary nav__cta" onClick={close}>
              {nav.ctaText}
            </Link>
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
