import './Footer.css'

export default function Footer({ cfg }) {
  const { footer, business, nav } = cfg
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer__inner">

        <div className="footer__brand">
          <p className="footer__logo">{business.name}</p>
          <p className="footer__tagline">{footer?.tagline || business.tagline}</p>

          <div className="footer__contact-row">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="footer__contact-link">
                📞 {business.phone}
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`} className="footer__contact-link">
                ✉️ {business.email}
              </a>
            )}
          </div>

          {business.license && (
            <p className="footer__license">{business.license}</p>
          )}
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          {(footer?.links || nav?.links || []).map(link => (
            <a key={link.href} href={link.href} className="footer__nav-link">
              {link.label}
            </a>
          ))}
        </nav>

      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} {business.name}. All rights reserved.</p>
          {business.address && <p>{business.address}</p>}
        </div>
      </div>
    </footer>
  )
}
